import FakeHashProvider from "../infra/providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "./UpdateProfileService";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import AppError from "@shared/errors/AppError";

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUserRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {

    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUserRepository = new FakeUserRepository();
        updateProfileService = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider
        );
    });

    it('Should be able to update users´s profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe Doe',
            email: 'johndoe@example.com.br',
        });

        expect(updatedUser?.name).toBe('John Doe Doe');
        expect(updatedUser?.email).toBe('johndoe@example.com.br');
    });


    it('Should not be able to update for the same existing email value.', async () => {
        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user = await fakeUserRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe Doe',
            email: 'johndoe@example.com',
            old_password: '123456',
            password: '654321'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should be able to update users´s password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: user.name,
            email: user.email,
            old_password: '123456',
            password: '654321'
        });

        expect(updatedUser?.password).toBe('654321');
    });

    it('Should not be able to update users´s password without old passwod', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe Doe',
            email: 'johndoe@example.com.br',
            password: '654321'
        })).rejects.toBeInstanceOf(AppError);
    });

});
