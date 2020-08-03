import { injectable, inject } from "tsyringe";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import getHours from 'date-fns/esm/fp/getHours';
import isAfter from 'date-fns/esm/fp/isAfter';

interface IRequest {
    provider_id: string;
    day: number,
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailability {
    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: IAppointmentRepository
    ) {
    }

    public async execute({ provider_id, day, month, year }: IRequest):
        Promise<IResponse> {

        const appointments =
            await this.appointmentRepository.findInMonthFromProvider({
                provider_id,
                month,
                year
            });

        const hourStart = 8;

        const eachHourInDay = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourInDay.map(hour => {
            const hasAppointmentAtHour = appointments.find(
                appointment => getHours(appointment.date) === hour
            );

            let compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointmentAtHour && isAfter(compareDate, currentDate),
            }
        });

        return availability as IResponse;
    }
}

export default ListProviderDayAvailability;