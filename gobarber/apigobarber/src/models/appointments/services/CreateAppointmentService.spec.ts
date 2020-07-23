import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import { isUuid } from 'uuidv4';

describe('CreateAppointment', () => {
  it('Should be able to create a new Appointment', async () => {
    const fakeRepository = new FakeAppointmentRepository();
    const service = new CreateAppointmentService(fakeRepository);

    const newAppointment = await service.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    expect(newAppointment).toHaveProperty('id');
    expect(newAppointment.provider_id).toBe('123456789');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const fakeRepository = new FakeAppointmentRepository();
    const service = new CreateAppointmentService(fakeRepository);

    const date = new Date();

    const newAppointment = await service.execute({
      date: date,
      provider_id: '123456789',
    });

    expect(isUuid(newAppointment.id)).toBeTruthy();

    await expect(service.execute({
      date: date,
      provider_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);
  });
});
