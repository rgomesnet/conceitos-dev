"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
require("@models/users/infra/providers");
require("@shared/providers");
var AppointmentRepository_1 = __importDefault(require("@models/appointments/infra/typeorm/repositories/AppointmentRepository"));
var UserRepository_1 = __importDefault(require("@models/users/infra/typeorm/repository/UserRepository"));
var UserTokenRepository_1 = __importDefault(require("@models/users/infra/typeorm/repository/UserTokenRepository"));
tsyringe_1.container.registerSingleton('AppointmentRepository', AppointmentRepository_1.default);
tsyringe_1.container.registerSingleton('UserRepository', UserRepository_1.default);
tsyringe_1.container.registerSingleton('UserTokenRepository', UserTokenRepository_1.default);
