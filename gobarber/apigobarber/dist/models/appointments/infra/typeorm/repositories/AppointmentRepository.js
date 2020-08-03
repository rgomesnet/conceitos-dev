"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Appointment_1 = __importDefault(require("@models/appointments/infra/typeorm/entities/Appointment"));
var typeorm_2 = require("typeorm");
var AppointmentRepository = /** @class */ (function () {
    function AppointmentRepository() {
        this.repository = typeorm_2.getRepository(Appointment_1.default);
    }
    AppointmentRepository.prototype.findInDayFromProvider = function (_a) {
        var provider_id = _a.provider_id, day = _a.day, month = _a.month, year = _a.year;
        return __awaiter(this, void 0, void 0, function () {
            var parseDay, parsedMonth, appointments;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parseDay = String(day).padStart(2, '0');
                        parsedMonth = String(month).padStart(2, '0');
                        return [4 /*yield*/, this.repository.find({
                                where: {
                                    provider_id: provider_id,
                                    date: typeorm_1.Raw(function (dateFieldName) {
                                        return "to_char(" + dateFieldName + ", 'DD-MM-YYYY') = '" + parseDay + "-" + parsedMonth + "-" + year + "'";
                                    }),
                                }
                            })];
                    case 1:
                        appointments = _b.sent();
                        return [2 /*return*/, appointments];
                }
            });
        });
    };
    AppointmentRepository.prototype.findInMonthFromProvider = function (_a) {
        var provider_id = _a.provider_id, month = _a.month, year = _a.year;
        return __awaiter(this, void 0, void 0, function () {
            var parsedMonth, appointments;
            return __generator(this, function (_b) {
                parsedMonth = String(month).padStart(2, '0');
                appointments = this.repository.find({
                    where: {
                        provider_id: provider_id,
                        date: typeorm_1.Raw(function (dateFieldName) {
                            return "to_char(" + dateFieldName + ", 'MM-YYYY') = '" + parsedMonth + "-" + year + "'";
                        }),
                    }
                });
                return [2 /*return*/, appointments];
            });
        });
    };
    AppointmentRepository.prototype.findByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var findAppointment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne({
                            where: { date: date },
                        })];
                    case 1:
                        findAppointment = _a.sent();
                        return [2 /*return*/, findAppointment];
                }
            });
        });
    };
    AppointmentRepository.prototype.create = function (_a) {
        var provider_id = _a.provider_id, user_id = _a.user_id, date = _a.date;
        return __awaiter(this, void 0, void 0, function () {
            var appointment;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        appointment = this.repository.create({
                            provider_id: provider_id,
                            user_id: user_id,
                            date: date
                        });
                        return [4 /*yield*/, this.repository.save(appointment)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentRepository = __decorate([
        typeorm_1.EntityRepository(Appointment_1.default),
        __metadata("design:paramtypes", [])
    ], AppointmentRepository);
    return AppointmentRepository;
}());
exports.default = AppointmentRepository;
