import { inject, injectable } from "tsyringe";
import IAppointmentRepository from "../repositories/IAppointmentRepository";
import Appointment from "../infra/typeorm/entities/Appointment";
import ICacheProvider from "@shared/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {
    }

    public async execute({ provider_id, day, year, month }: IRequest): Promise<Appointment[]> {
        const cacheKey = `provider-appointments:${provider_id}-${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.get<Appointment[]>(
            cacheKey
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findInDayFromProvider({
                provider_id,
                year,
                month,
                day
            });

            console.log('buscou do banco');

            await this.cacheProvider.save(cacheKey, appointments);
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;