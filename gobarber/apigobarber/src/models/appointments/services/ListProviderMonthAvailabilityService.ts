import { injectable, inject } from "tsyringe";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import { getDaysInMonth, getDate } from 'date-fns';


interface IRequest {
    provider_id: string;
    month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: IAppointmentRepository
    ) {
    }

    public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findInMonthFromProvider({
            provider_id,
            year,
            month
        });

        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month - 1)
        );

        const eachDayInMont = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const availability = eachDayInMont.map(day => {
            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available: appointments.length < 10
            }
        });

        return availability as IResponse;
    }
}

export default ListProviderMonthAvailabilityService;