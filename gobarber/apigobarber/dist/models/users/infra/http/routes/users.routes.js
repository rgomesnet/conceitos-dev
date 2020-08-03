"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var ensureAuthenticated_1 = __importDefault(require("@models/users/infra/http/middlewares/ensureAuthenticated"));
var upload_1 = __importDefault(require("@config/upload"));
var UserController_1 = __importDefault(require("../controllers/UserController"));
var usersRouter = express_1.Router();
var userController = new UserController_1.default();
var upload = multer_1.default(upload_1.default);
usersRouter.get('/', userController.get);
usersRouter.post('/', userController.create);
usersRouter.patch('/avatar', ensureAuthenticated_1.default, upload.single('avatar'), userController.update);
exports.default = usersRouter;
