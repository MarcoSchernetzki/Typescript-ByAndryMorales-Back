import { User, UserI } from '../entities/user.js';
import { passwdEncrypt } from '../services/auth.js';
import { BasicRepo, id } from './data.js';
import createDebug from 'debug';
const debug = createDebug('MS:repositories:user');

export class UserRepository implements BasicRepo<UserI> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    #Model = User;
    private constructor() {
        debug('instance');
    }

    async findOne(id: id): Promise<UserI> {
        debug('findOne', id);

        const result = await this.#Model
            .findById(id)
            .populate('myProducts.productId');

        if (!result) throw new Error('Not found id');
        return result;
    }
    async get(id: id): Promise<UserI> {
        debug('get', id);
        const result = await this.#Model.findById(id).populate('myProducts');
        console.log(result);

        if (!result) throw new Error('Not found id');
        return result as UserI;
    }

    async create(data: Partial<UserI>): Promise<UserI> {
        debug('create', data);
        if (typeof data.passwd !== 'string') throw new Error('');
        data.passwd = await passwdEncrypt(data.passwd);
        const result = await (
            await this.#Model.create(data)
        ).populate('myProducts');
        return result;
    }

    async find(search: { [key: string]: string }): Promise<UserI> {
        debug('find', { search });
        const result = await this.#Model
            .findOne(search)
            .populate('myProducts.productId');
        // pese a lo indicado en la documentacion, no puedo hacer que devuelva null
        // if (!result) throw new Error('Not found id');
        return result as UserI;
    }
    async update(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('update', id);
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('myProducts.productId');
        if (!result) throw new Error('Not found id');

        return result;
    }
}
