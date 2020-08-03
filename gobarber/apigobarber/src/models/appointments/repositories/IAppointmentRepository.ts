import Appointment from "@models/appointments/infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindInMonthFromProviderDTO from "../dtos/IFindInMonthFromProvider";
import IFindInDayFromProviderDTO from "../dtos/IFindInDayFromProviderDTO";

interface IAppointmentRepository {
  create(dto: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findInMonthFromProvider(
    data: IFindInMonthFromProviderDTO,
  ): Promise<Appointment[]>;

  findInDayFromProvider(
    data: IFindInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}

export default IAppointmentRepository;
