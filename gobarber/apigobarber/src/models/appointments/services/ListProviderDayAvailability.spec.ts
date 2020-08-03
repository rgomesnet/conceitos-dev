import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderDayAvailability from './ListProviderDayAvailability';

let appointmentRepository: FakeAppointmentRepository;
let service: ListProviderDayAvailability;

describe('ListProviderMonthAvailabilityService', () => {
    beforeEach(() => {
        appointmentRepository = new FakeAppointmentRepository();
        service = new ListProviderDayAvailability(
            appointmentRepository
        );
    });

    it('Should be able to list the day availabitlity from provider', async () => {

        await appointmentRepository.create({
            provider_id: 'user',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 12, 0, 0)
        });

        await appointmentRepository.create({
            provider_id: 'user',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 13, 0, 0)
        });

        await appointmentRepository.create({
            provider_id: 'user',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 15, 0, 0)
        });

        await appointmentRepository.create({
            provider_id: 'user',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 17, 0, 0)
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });

        const avaiabilities = await service.execute({
            provider_id: 'user',
            day: 20,
            month: 5,
            year: 2020
        });

        expect(avaiabilities).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 11, available: false },
            { hour: 12, available: false },
            { hour: 13, available: false },
            { hour: 14, available: true },
            { hour: 15, available: false },
            { hour: 16, available: true },
            { hour: 17, available: false },
        ]));
    });
});
