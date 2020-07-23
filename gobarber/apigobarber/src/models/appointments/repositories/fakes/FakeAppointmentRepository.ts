import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@models/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@models/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';

class AppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(a => a.date == a.date);
    return appointment;
  }

  public async create({ provider_id, date }:
    ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
