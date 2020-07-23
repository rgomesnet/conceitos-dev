import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';
import { startOfHour } from 'date-fns';

interface RequestDTO {
    provider: string;
    date: Date;
}

class CreateAppointmentService {

    private repository: AppointmentRepository;

    constructor(repository: AppointmentRepository) {
        this.repository = repository;
    }

    public execute({ date, provider }: RequestDTO): Appointment {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = this.repository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw Error('This appointment has been already booked');
        }

        const appointment = this.repository.create({ provider, date: appointmentDate });
        return appointment;
    }
}

export default CreateAppointmentService;
