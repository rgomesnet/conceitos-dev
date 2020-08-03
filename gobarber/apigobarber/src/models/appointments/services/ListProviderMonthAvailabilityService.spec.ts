import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let appointmentRepository: FakeAppointmentRepository;
let service: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
    beforeEach(() => {
        appointmentRepository = new FakeAppointmentRepository();
        service = new ListProviderMonthAvailabilityService(
            appointmentRepository
        );
    });

    it('Should be able to list the mont availabitlity from provider', async () => {

        for (let hour = 8; hour <= 16; hour++) {
            await appointmentRepository.create({
                provider_id: 'user',
                user_id: 'user_id',
                date: new Date(2020, 4, 20, hour, 0, 0)
            });
        }

        const avaiabilities = await service.execute({
            provider_id: 'user',
            month: 5,
            year: 2020
        });

        expect(avaiabilities).toEqual(expect.arrayContaining([
            { day: 20, available: true },
        ]));
    });
});
