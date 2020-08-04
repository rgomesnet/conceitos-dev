import { injectable, inject } from "tsyringe";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import { getHours, isAfter } from 'date-fns';

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

    public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findInDayFromProvider({
            day,
            month,
            provider_id,
            year
        });

        const hourStart = 8;

        const eachHourInDay = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourInDay.map(hour => {
            const hasAppointment = appointments.find(app => getHours(app.date) === hour);

            let compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointment && isAfter(compareDate, currentDate)
            }
        });

        return availability;
    }

}

export default ListProviderDayAvailability;