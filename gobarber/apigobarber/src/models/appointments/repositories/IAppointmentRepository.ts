import Appointment from "@models/appointments/infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

interface IAppointmentRepository {
  create(dto: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}

export default IAppointmentRepository;
