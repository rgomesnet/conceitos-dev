import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@models/appointments/repositories/IAppointmentRepository';
import { getRepository } from 'typeorm';
import ICreateAppointmentDTO from '@models/appointments/dtos/ICreateAppointmentDTO';

@EntityRepository(Appointment)
class AppointmentRepository implements IAppointmentRepository {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.repository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({ provider_id, date }:
    ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.repository.create({
      provider_id,
      date
    });

    await this.repository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
