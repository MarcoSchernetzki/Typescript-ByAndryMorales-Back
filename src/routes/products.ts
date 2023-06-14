import { Router } from 'express';
import { ProductController } from '../controllers/product.js';
import { logged, iAmAdmin } from '../middlewares/interceptors.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

export const productRouter = Router();

const controller = new ProductController(
    ProductRepository.getInstance(),
    UserRepository.getInstance()
);

productRouter.get('/', controller.getAll.bind(controller));
productRouter.get('/:id', logged, controller.get.bind(controller));
productRouter.post(
    '/',
    logged,
    iAmAdmin,
    controller.createProduct.bind(controller)
);
productRouter.patch(
    '/:id',
    logged,
    iAmAdmin,
    controller.updateProduct.bind(controller)
);
productRouter.delete(
    '/:id',
    logged,
    iAmAdmin,
    controller.delete.bind(controller)
);
