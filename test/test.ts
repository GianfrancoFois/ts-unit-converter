import {expect} from 'chai';
import {DeviceMapper, StrictDeviceMapper} from "./mapper";
import {Account, Device, User} from "./entities";

const deviceMapper = new DeviceMapper();
const strictDeviceMapper = new StrictDeviceMapper();
const user = new User({email: "test@test.com", id: 1, password: "1234"});
const user2 = new User({email: "test2@test.com", id: 2, password: "5432"});
const account = new Account({users: [user, user2], lastName: "last", firstName: "first", id: 1});
const device = new Device({id: 1, name: "Moto g", account, type: "Phone", year: 2020, internalCode: "abcd"});

describe('Morpher', () => {


    it('should map to dto and back with same name properties', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.type).to.be.equal("Phone");
        const entity = deviceMapper.toEntity(deviceDTO);
        expect(entity.type).to.be.equal("Phone");
    });

    it('should map to dto and back using transform functions', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.name).to.be.equal("MOTO G");
        const entity = deviceMapper.toEntity(deviceDTO);
        expect(entity.name).to.be.equal("moto g");
    });

    it('should ignore fields', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.account.id).to.be.undefined;
    });

    it('should map with nested mappers', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.account.fullname).to.be.equal("first last");
        const entity = deviceMapper.toEntity(deviceDTO);
        expect(entity.account.firstName).to.be.equal("first");
        expect(entity.account.lastName).to.be.equal("last");
    });

    it('should not map unmatched properties with strict mappings', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect((deviceDTO as any).internalCode).to.be.not.undefined;
        const strictDeviceDTO = strictDeviceMapper.toDTO(device);
        expect((strictDeviceDTO as any).internalCode).to.be.undefined;
    });

    it('should map to different name property and parse number', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.yearString).to.be.string("2020");
        const entity = deviceMapper.toEntity(deviceDTO);
        expect(entity.year).to.be.a("number").equal(2020);
    });

    it('should map an array of users', () => {
        const deviceDTO = deviceMapper.toDTO(device);
        expect(deviceDTO.account.users[0].id).to.be.string("1");
        expect(deviceDTO.account.users[1].id).to.be.string("2");
    });

    it('should handle nulls', () => {
        const deviceNull = deviceMapper.toDTO(null);
        expect(deviceNull).to.be.null;
    });

    it('should throw an exepcion in the transform', () => {
        expect(() => {
            deviceMapper.toDTO(new Device({
                id: null,
                type: "Device"
            }));
        }).to.throw;
    });

    it('should handle null properties', () => {
        const dto = deviceMapper.toDTO(new Device({
            id: null,
            type: "Device",
            account: new Account({
                firstName: 'x',
                lastName: 'x',
                users: null
            }),
            name: "Device",
            year: null,
        }));
        expect(dto.account.users).to.be.null;
        expect(dto.type).to.be.string("Device");
    });

});

