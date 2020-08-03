import AppError from "@shared/errors/AppError";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import ListProvidersService from "./ListProvidersService";

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;

describe('ShowProfileService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        listProvidersService = new ListProvidersService(
            fakeUserRepository
        );
    });

    it('Should be able to list providers', async () => {

        const user01 = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user02 = await fakeUserRepository.create({
            name: 'Ray Doe',
            email: 'ray@example.com',
            password: '123456'
        });

        const authenticatedUser = await fakeUserRepository.create({
            name: 'Admin Admin',
            email: 'admin@example.com',
            password: '123456'
        });

        const providers = await listProvidersService.execute({
            user_id: authenticatedUser.id
        });

        expect(providers.length).toBe(2);
        expect(providers).toEqual(expect.arrayContaining(
            [user01, user02]
        ));;
    });

});
