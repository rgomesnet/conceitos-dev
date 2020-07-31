import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import { isUuid } from 'uuidv4';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );
  });

  it('Should be able to create a new Appointment', async () => {
    const newAppointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('123456789');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const date = new Date();

    const newAppointment = await createAppointmentService.execute({
      date: date,
      provider_id: '123456789',
    });

    expect(isUuid(newAppointment.id)).toBeTruthy();

    await expect(createAppointmentService.execute({
      date: date,
      provider_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);
  });
});
