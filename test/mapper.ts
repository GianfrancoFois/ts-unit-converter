import {MappingSchema, Mapper, StrictMappingSchema} from "../src/morpher/Mapper";
import {Account, Device, User} from "./entities";
import {AccountDTO, DeviceDTO, UserDTO} from "./dtos";

export class DeviceMapper extends Mapper<Device, DeviceDTO> {

    entity = Device;
    dto = DeviceDTO;

    getToEntitySchema(): MappingSchema<DeviceDTO, Device> {
        return new MappingSchema<DeviceDTO, Device>({
            id: {ignore: true},
            name: {transform: x => x.name?.toLowerCase()},
            account: {useMapper: AccountMapper},
            year: {from: 'yearString', mapTo: "int"}
        })
    }

    getToDTOSchema(): MappingSchema<Device, DeviceDTO> {
        return new MappingSchema<Device, DeviceDTO>({
            account: {useMapper: AccountMapper},
            name: {transform: x => x.name.toUpperCase()},
            yearString: {from: 'year', mapTo: "string"}
        })
    }

}

export class AccountMapper extends Mapper<Account, AccountDTO> {

    entity = Account;
    dto = AccountDTO;

    getToEntitySchema(): MappingSchema<AccountDTO, Account> {
        return new MappingSchema<AccountDTO, Account>({
            firstName: {transform: dto => dto.fullname.split(' ')[0] ?? ''},
            lastName: {transform: dto => dto.fullname.split(' ')[1] ?? ''},
            users: {useMapper: UserMapper}
        })
    }

    getToDTOSchema(): MappingSchema<Account, AccountDTO, never> {
        return new MappingSchema<Account, AccountDTO>({
            fullname: {transform: account => account.firstName + " " + account.lastName},
            id: {ignore: true},
            users: {useMapper: UserMapper}
        })
    }

}

export class UserMapper extends Mapper<User, UserDTO> {

    entity = User;
    dto = UserDTO;

    getToEntitySchema(): MappingSchema<UserDTO, User> {
        return new MappingSchema<UserDTO, User>({
            id: {mapTo: 'string'}
        })
    }

    getToDTOSchema(): MappingSchema<User, UserDTO> {
        return new MappingSchema<User, UserDTO>({
            id: {mapTo: 'string'}
        })
    }

}

export class StrictDeviceMapper extends Mapper<Device, DeviceDTO> {

    entity = Device;
    dto = DeviceDTO;

    getToEntitySchema(): MappingSchema<DeviceDTO, Device> {
        return new StrictMappingSchema<DeviceDTO, Device>({
            id: {ignore: true},
            name: {transform: x => x.name?.toLowerCase()},
            account: {useMapper: AccountMapper},
            type: "type",
            internalCode: {ignore: true},
            year: {from: 'yearString', mapTo: 'int'}
        })
    }

    getToDTOSchema(): MappingSchema<Device, DeviceDTO> {
        return new StrictMappingSchema<Device, DeviceDTO>({
            account: {useMapper: AccountMapper},
            name: {transform: x => x.name.toUpperCase()},
            id: 'id',
            type: 'type',
            yearString: {from: 'year', mapTo: 'string'}
        })
    }

}
