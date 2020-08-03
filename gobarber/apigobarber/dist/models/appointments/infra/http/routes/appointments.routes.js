"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AppointmentController_1 = __importDefault(require("../controllers/AppointmentController"));
var appointmentsRouter = express_1.Router();
var appointmentsController = new AppointmentController_1.default();
appointmentsRouter.post('/', appointmentsController.create);
exports.default = appointmentsRouter;
