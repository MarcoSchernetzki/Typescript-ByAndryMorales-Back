import { Product, ProductI, ProtoProductI } from '../entities/product.js';
import { id, Repo } from './data.js';
import createDebug from 'debug';
const debug = createDebug('MS:repositories:product');

export class ProductRepository implements Repo<ProductI> {
    static instance: ProductRepository;

    public static getInstance(): ProductRepository {
        if (!ProductRepository.instance) {
            ProductRepository.instance = new ProductRepository();
        }
        return ProductRepository.instance;
    }

    #Model = Product;

    private constructor() {
        debug('instance');
    }

    async findAll(): Promise<Array<ProductI>> {
        debug('findAll');
        return this.#Model.find().populate('clients');
    }

    async findOne(id: id): Promise<ProductI> {
        debug('findOne', id);
        const result = await this.#Model.findById(id).populate('clients');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async create(data: ProtoProductI): Promise<ProductI> {
        debug('create', data);
        const result = await await this.#Model.create(data);
        return result;
    }
    async update(id: id, data: Partial<ProductI>): Promise<ProductI> {
        debug('update', id);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!result) throw new Error('Not found id');
        return result;
    }
    async delete(id: id): Promise<id> {
        debug('delete', id);
        await this.#Model.findByIdAndDelete(id);
        // no puedo hacer que me devuelva null
        //if (!result) throw new Error('Not found id');
        return id;
    }
    async find(search: Partial<ProductI>): Promise<ProductI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search).populate('clients');
        if (!result) throw new Error('Not found id');
        return result;
    }
}
