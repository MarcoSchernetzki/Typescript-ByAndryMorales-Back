import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { logged } from '../middlewares/interceptors.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

export const usersRouter = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    ProductRepository.getInstance()
);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.get('/:id', controller.get.bind(controller));
usersRouter.patch(
    '/cart/add/:productId',
    logged,
    controller.addCart.bind(controller)
);
usersRouter.patch(
    '/cart/update/:productId',
    logged,
    controller.updateCart.bind(controller)
);
usersRouter.patch(
    '/cart/delete/:productId',
    logged,
    controller.deleteCart.bind(controller)
);
