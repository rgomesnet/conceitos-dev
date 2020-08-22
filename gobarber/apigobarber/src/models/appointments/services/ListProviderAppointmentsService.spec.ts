import FakeAppointmentRepository from "../repositories/fakes/FakeAppointmentRepository";
import ListProviderAppointmentsService from "./ListProviderAppointmentsService";
import FakeCacheProvider from "@shared/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeAppointmentsRepository: FakeAppointmentRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;
describe('', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService =
            new ListProviderAppointmentsService(fakeAppointmentsRepository, fakeCacheProvider);
    });

    it('Should be able to list the appointments on specific day', async () => {
        const appointmento_01 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        const appointmento_02 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const availabitliy = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            day: 20,
            month: 5,
            year: 2020
        });

        expect(availabitliy).toEqual([
            appointmento_01,
            appointmento_02
        ]);

    });

})