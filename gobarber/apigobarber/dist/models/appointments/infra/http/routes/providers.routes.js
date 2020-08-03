"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ProvidersController_1 = __importDefault(require("../controllers/ProvidersController"));
var ensureAuthenticated_1 = __importDefault(require("@models/users/infra/http/middlewares/ensureAuthenticated"));
var ProviderDayAvailabilityController_1 = __importDefault(require("../controllers/ProviderDayAvailabilityController"));
var ProviderMonthAvailabilityController_1 = __importDefault(require("../controllers/ProviderMonthAvailabilityController"));
var providerController = new ProvidersController_1.default();
var providerDayAvailabilityController = new ProviderDayAvailabilityController_1.default();
var providerMontAvailabilityController = new ProviderMonthAvailabilityController_1.default();
var providersRouter = express_1.Router();
providersRouter.use(ensureAuthenticated_1.default);
providersRouter.get('/', providerController.get);
providersRouter.get('/:id/month-availability', providerDayAvailabilityController.index);
providersRouter.get('/:id/day-availability', providerMontAvailabilityController.index);
exports.default = providersRouter;
