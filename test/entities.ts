export class User {
    id: number;
    email: string;
    password: string;

    constructor(o?: Partial<User>) {
        Object.assign(this, o);
    }
}

export class Account {
    id: number;
    firstName: string;
    lastName: string;
    users: User[];

    constructor(o?: Partial<Account>) {
        Object.assign(this, o);
    }
}

export class Device {
    id: number;
    name: string;
    type: string;
    internalCode: string;
    account: Account;
    year: number;

    constructor(o?: Partial<Device>) {
        Object.assign(this, o);
    }
}

export class MobileDevice extends Device {
    phoneNumber: string;

    constructor(o?: Partial<MobileDevice>) {
        super(o);
        Object.assign(this, o);
    }
}
