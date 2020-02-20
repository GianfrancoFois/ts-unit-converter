export class UserDTO {
    id: string;
    email: string;

    constructor(o?: Partial<UserDTO>) {
        Object.assign(this, o);
    }
}

export class AccountDTO {
    id: number;
    fullname: string;
    users: UserDTO[];

    constructor(o?: Partial<AccountDTO>) {
        Object.assign(this, o);
    }
}

export class DeviceDTO {
    id: number;
    name: string;
    type: string;
    account: AccountDTO;
    yearString: string;

    constructor(o?: Partial<DeviceDTO>) {
        Object.assign(this, o);
    }
}

export class MobileDeviceDTO extends DeviceDTO {
    phoneNumber: string;

    constructor(o?: Partial<MobileDeviceDTO>) {
        super(o);
        Object.assign(this, o);
    }
}
