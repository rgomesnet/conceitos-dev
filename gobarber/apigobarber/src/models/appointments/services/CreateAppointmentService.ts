import { startOfHour, isBefore, getHours, format, getYear, getMonth, getDay } from 'date-fns';
import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import INotificationRepository from '@models/notifications/repositories/INotificationRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {

  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider) { }

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

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment has been already booked');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormat = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormat}h`
    });

    const cacheKey = `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`;
    await this.cacheProvider.invalidade(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;
