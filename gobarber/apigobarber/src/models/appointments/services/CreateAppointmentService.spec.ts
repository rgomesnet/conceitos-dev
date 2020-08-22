import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import FakeNotificationRepository from '@models/notifications/repositories/fakes/FakeNotificationRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import { isUuid } from 'uuidv4';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeCacheProvider
    );
  });

  it('Should be able to create a new Appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const newAppointment = await createAppointmentService.execute({
      provider_id: '123456789',
      user_id: 'user',
      date: new Date(2020, 4, 10, 13),
    });

    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('123456789');
  });

  it('Should not be able to create two appointments on the same time', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const newAppointment = await createAppointmentService.execute({
      provider_id: '123456789',
      user_id: 'user',
      date: new Date(2020, 4, 10, 16)
    });

    expect(isUuid(newAppointment.id)).toBeTruthy();

    await expect(createAppointmentService.execute({
      provider_id: '123456789',
      user_id: 'user',
      date: new Date(2020, 4, 10, 16)
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create on past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      provider_id: '123456',
      user_id: '123456',
      date: new Date(2020, 4, 10, 11),
    }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      provider_id: '123456',
      user_id: '123456',
      date: new Date(2020, 4, 10, 13),
    }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create before 7 a.m.', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      provider_id: '123456X',
      user_id: '123456Z',
      date: new Date(2020, 4, 11, 7),
    }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create after 6 p.m.', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      provider_id: '123456XX',
      user_id: '123456ZX',
      date: new Date(2020, 4, 11, 19),
    }),
    ).rejects.toBeInstanceOf(AppError);
  });


});
