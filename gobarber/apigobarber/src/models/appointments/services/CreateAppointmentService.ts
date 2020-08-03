import { startOfHour, isBefore, getHours } from 'date-fns';
import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository) {
    this.repository = repository;
  }

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Appointment hour is not available');
    }

    if (provider_id === user_id) {
      throw new AppError('You cannot create a self-service appointment.');
    }

    if (getHours(appointmentDate) < 8 ||
      getHours(appointmentDate) > 17) {
      throw new AppError('Appointments available only between 8 a.m. and 5 p.m.');
    }

    const findAppointmentInSameDate = await this.repository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment has been already booked');
    }

    const appointment = await this.repository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
