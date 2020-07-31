import AppError from "@shared/errors/AppError";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import ShowProfileService from "./ShowProfileService";

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfileService = new ShowProfileService(
            fakeUserRepository
        );
    });

    it('Should be able to show users´s profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const userProfile = await showProfileService.execute({
            user_id: user.id
        });

        expect(userProfile?.name).toBe('John Doe');
        expect(userProfile?.email).toBe('johndoe@example.com');
    });

});
