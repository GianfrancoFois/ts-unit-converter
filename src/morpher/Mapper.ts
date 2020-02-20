import {ClassmapperConfig} from "./ClassmapperConfig";

export class Mapper<Entity = any, DTO = any, NamedConfig = never> {

    dto: ClassType<DTO>;
    entity: ClassType<Entity>;

    getToDTOSchema(): MappingSchema<Entity, DTO, NamedConfig> {
        return new MappingSchema<Entity, DTO, NamedConfig>();
    }

    getToEntitySchema(): MappingSchema<DTO, Entity, NamedConfig> {
        return new MappingSchema<DTO, Entity, NamedConfig>();
    }

    toDTO(entity: Entity, configName?: NamedConfig): DTO {
        if (entity == null) return null;
        const dto = new this.dto();
        this._performMapping(this.getToDTOSchema(), entity, dto, 'dto');
        return dto;
    }

    toEntity(dto: DTO, configName?: NamedConfig): Entity {
        if (dto == null) return null;
        const entity = new this.entity();
        this._performMapping(this.getToEntitySchema(), dto, entity, 'entity');
        return entity;
    }

    async toDTOAsync(entity: Entity, configName?: NamedConfig): Promise<DTO> {
        if (entity == null) return null;
        const dto = new this.dto();
        await this._performMappingAsync(this.getToDTOSchema(), entity, dto, 'dto');
        return dto;
    }

    async toEntityAsync(dto: DTO, configName?: NamedConfig): Promise<Entity> {
        if (dto == null) return null;
        const entity = new this.entity();
        await this._performMappingAsync(this.getToEntitySchema(), dto, entity, 'entity');
        return entity;
    }

    toDTOList(entities: Entity[], configName?: NamedConfig): DTO[] {
        if (entities == null) return null;
        return entities?.map(entity => this.toDTO(entity));
    }

    toEntityList(dtos: DTO[], configName?: NamedConfig): Entity[] {
        if (dtos == null) return null;
        return dtos.map(dto => this.toEntity(dto));
    }

    async toDTOListAsync(entities: Entity[], configName?: NamedConfig): Promise<DTO[]> {
        if (entities == null) return null;
        const dtos = [];
        for (let i = 0; i < entities.length; i++) {
            entities.push(await this.toEntityAsync(dtos[i]));
        }
        return dtos;
    }

    async toEntityListAsync(dtos: DTO[], configName?: NamedConfig): Promise<Entity[]> {
        if (dtos == null) return null;
        const entities = [];
        for (let i = 0; i < dtos.length; i++) {
            entities.push(await this.toEntityAsync(dtos[i]));
        }
        return entities;
    }

    /* ----------------------------- */

    _toDtoSchema: MappingSchema<Entity, DTO, NamedConfig>;
    _toEntitySchema: MappingSchema<DTO, Entity, NamedConfig>;

    private _getToDTOSchema(): MappingSchema<Entity, DTO, NamedConfig> {
        if (this._toDtoSchema == null) {
            this._toDtoSchema = this.getToDTOSchema();
        }
        return this._toDtoSchema;
    }

    private _getToEntitySchema(): MappingSchema<DTO, Entity, NamedConfig> {
        if (this._toEntitySchema == null) {
            this._toEntitySchema = this.getToEntitySchema();
        }
        return this._toEntitySchema;
    }

    private _performMapping(schema: MappingSchema, source, target, to: 'dto' | 'entity') {

        let keys: string[] | Set<string>;
        if (ClassmapperConfig.usingDefineForClassFields) {
            keys = Object.getOwnPropertyNames(target);
        } else if (schema.isStrict) {
            //In this case the keys of the schema are all of the keys present in the target.
            keys = schema.keys;
        } else {
            // Combine the keys defined in the source, with the keys mapped explicitly in the schema.
            // this can result in the target having more properties than it should. See docs for more info
            keys = new Set([...Object.getOwnPropertyNames(source), ...schema.keys]);
        }

        keys.forEach(key => {
            const unknownMapping = schema.getPropertyMapping(key);
            let mapping: ExplicitPropertyMapping;

            //Evaluate alias for {from}
            if (typeof mapping === "string") {
                mapping = {from: mapping};
            } else if(propertyMappingIsExplicit(unknownMapping)){
                mapping = unknownMapping;
            }

            const sourceValue = getSourceValue(mapping, source, key);

            if(Array.isArray(sourceValue)){
                target[key] = sourceValue.map(sourceValueItem => {
                    const value = mapValue(source, sourceValueItem, mapping, to);
                    return value;
                })
            } else {
                target[key] = mapValue(source, sourceValue, mapping, to);
            }

        });
    }


    private async _performMappingAsync(schema: MappingSchema, source, target, to: 'dto' | 'entity'): Promise<void> {
        this._performMapping(schema, source, target, to);
    }

}

function mapValue<Source>(source: Source, sourceValue, mapping: ExplicitPropertyMapping, to: 'dto' | 'entity'): any {
    if(!mapping) return sourceValue;

    if (mapping.ignore) {
        //ignore!
    } else if (mapping.transform && source != null) {
        return mapping.transform(source);
    } else if (mapping.mapTo) {
        switch (mapping.mapTo) {
            case "float":
            case "number":
                return sourceValue != null ? parseFloat(sourceValue) : null;
            case "int":
                return sourceValue != null ? parseInt(sourceValue) : null;
            case "string":
                return sourceValue != null ? sourceValue + '' : null;
        }
    } else if (mapping.useMapper) {
        const mapper = getMapper(mapping.useMapper);
        return to === 'dto' ? mapper.toDTO(sourceValue) : mapper.toEntity(sourceValue);
    } else {
        /* simple mapping */
        return sourceValue;
    }
}

function getSourceValue(mapping: PropertyMapping, source, key: string): any {
    if(!mapping){
        return source[key];
    } else if(propertyMappingIsExplicit(mapping)){
        return mapping.from != null ? source[mapping.from] : source[key];
    } else {
        return source[mapping];
    }
}

const mapperMap = new WeakMap();

function getMapper<T extends Mapper>(mapper: ClassType<T>): T {
    if (mapperMap.has(mapper)) {
        return mapperMap.get(mapper);
    } else {
        const mapperInstance = new mapper();
        mapperMap.set(mapper, mapperInstance);
        return mapperInstance;
    }
}

export class MappingSchema<Source = any, Target = any, NamedConfig = never> {


    constructor(private mapping: MappingContructor<Source, Target> = {}, public isStrict = false) {
    }

    getPropertyMapping(key: string): PropertyMapping<Source, Target> {
        return this.mapping[key];
    }

    get keys(): string[] {
        return Object.keys(this.mapping);
    }

}

export class StrictMappingSchema<Source = any, Target = any, NamedConfig = never>
    extends MappingSchema<Source, Target, NamedConfig> {

    constructor(mapping: StrictMappingContructor<Source, Target>) {
        super(mapping as MappingContructor<Source, Target>, true);
    }
}

type StrictMappingContructor<Source, Target> = {
    [key in keyof Target]: PropertyMapping<Source, Target, Target[key]>
}

type MappingContructor<Source, Target> = {
    [key in keyof Target]?: PropertyMapping<Source, Target, Target[key]>
}

export type ClassType<T> = {
    new(...args: any[]): T;
}

function propertyMappingIsExplicit(propertyMapping: PropertyMapping): propertyMapping is ExplicitPropertyMapping {
    return typeof propertyMapping === "object";
}

export type PropertyMapping<Source = any, Target = any, KeyType = any> =
    ExplicitPropertyMapping<Source, Target, KeyType>
    | keyof Target //alias para {from: keyof Source}

export type ExplicitPropertyMapping<Source = any, Target = any, KeyType = any> = {
    ignore?: true,
    useMapper?: ClassType<Mapper>,
    mapTo?: 'string' | 'int' | 'float' | 'number'
    transform?: (source: Source) => KeyType,
    from?: keyof Source,
};
