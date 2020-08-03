import Appointment from '@models/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@models/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@models/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import IFindInMonthFromProviderDTO from '@models/appointments/dtos/IFindInMonthFromProvider';
import { getMonth, getYear, getDate } from 'date-fns';
import IFindInDayFromProviderDTO from '@models/appointments/dtos/IFindInDayFromProviderDTO';

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];


  public async findInDayFromProvider({
    provider_id,
    day,
    month,
    year }: IFindInDayFromProviderDTO): Promise<Appointment[]> {

    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    });

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(a => a.date == a.date);
    return appointment;
  }

  public async findInMonthFromProvider(
    { provider_id, month, year }: IFindInMonthFromProviderDTO): Promise<Appointment[]> {

    const appointments = this.appointments.filter(ap =>
      ap.provider_id === provider_id &&
      (getMonth(ap.date) + 1) === month &&
      getYear(ap.date) === year
    );

    return appointments;
  }

  public async create({ 
    provider_id, 
    user_id,
    date }:
    ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id});

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentRepository;
