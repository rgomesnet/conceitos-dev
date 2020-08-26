import { Router, response } from 'express';
import multer from 'multer';
import ensureAuthenticated from '@models/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UserController from '../controllers/UserController';

const usersRouter = Router();

const userController = new UserController();

usersRouter.get('/', userController.get);

usersRouter.post('/', userController.create);

const upload = multer(uploadConfig.multer);

usersRouter.patch('/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userController.update
);

export default usersRouter;
