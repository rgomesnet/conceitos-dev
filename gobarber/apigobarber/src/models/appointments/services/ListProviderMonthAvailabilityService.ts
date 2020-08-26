import { injectable, inject } from "tsyringe";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import { getDaysInMonth, getDate, isAfter } from 'date-fns';


interface IRequest {
    provider_id: string;
    month: number;
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

        const eachDayInMonth = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const today = new Date();

        const availability = eachDayInMonth.map(day => {

            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available:
                    isAfter(compareDate, today) && appointments.length < 10
            }
        });

        return availability as IResponse;
    }
}

export default ListProviderMonthAvailabilityService;