import { startOfHour } from 'date-fns';
import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository) {
    this.repository = repository;
  }

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.repository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment has been already booked');
    }

    const appointment = await this.repository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
