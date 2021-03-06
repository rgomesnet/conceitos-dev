import { container } from 'tsyringe';
import '@models/users/infra/providers';
import '@shared/providers';

import IAppointmentRepository from '@models/appointments/repositories/IAppointmentRepository';
import AppointmentRepository from "@models/appointments/infra/typeorm/repositories/AppointmentRepository";

import UserRepository from '@models/users/infra/typeorm/repository/UserRepository';
import IUserRepository from '@models/users/repositories/IUserRepository';

import IUserTokenRepository from '@models/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@models/users/infra/typeorm/repository/UserTokenRepository';
import INotificationRepository from '@models/notifications/repositories/INotificationRepository';
import NotificationRepository from '@models/notifications/infra/typeorm/repositories/NotificationRepository';

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository
);

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository
);

container.registerSingleton<IUserRepository>(
  'UserRepository',
  UserRepository
);

container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository
);
