export type id = number | string;

export interface BasicRepo<T> {
    findOne: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    find: (data: any) => Promise<T>;
}

export interface ExtraRepo<T> {
    findAll: () => Promise<Array<T>>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    findAll: () => Promise<Array<T>>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface UserRepo<T> extends BasicRepo<T> {
    get: (id: id) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
}
