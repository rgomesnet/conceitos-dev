import { EntityRepository, Repository, Raw } from 'typeorm';
import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@models/appointments/repositories/IAppointmentRepository';
import { getRepository } from 'typeorm';
import ICreateAppointmentDTO from '@models/appointments/dtos/ICreateAppointmentDTO';
import IFindInMonthFromProviderDTO from '@models/appointments/dtos/IFindInMonthFromProvider';
import IFindInDayFromProviderDTO from '@models/appointments/dtos/IFindInDayFromProviderDTO';

@EntityRepository(Appointment)
class AppointmentRepository implements IAppointmentRepository {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }

  public async findInDayFromProvider({ provider_id, day, month, year }:
    IFindInDayFromProviderDTO): Promise<Appointment[]> {
    const parseDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.repository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parsedMonth}-${year}'`
        ),
      }
    });

    return appointments;
  }

  public async findInMonthFromProvider(
    { provider_id, month, year }: IFindInMonthFromProviderDTO,
  ): Promise<Appointment[]> {

    const parsedMonth = String(month).padStart(2, '0');

    const appointments = this.repository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      }
    });

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.repository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({ provider_id, user_id, date }:
    ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.repository.create({
      provider_id,
      user_id,
      date
    });

    await this.repository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
