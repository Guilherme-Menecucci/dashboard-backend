import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import GetProfileService from './GetProfileService';

let fakeUsersRepository: FakeUsersRepository;
let getProfile: GetProfileService;

describe('GetProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    getProfile = new GetProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    const foundUser = await getProfile.execute(user.id);

    expect(foundUser?.display_name).toBe('John Doe');
    expect(foundUser?.pseudo_login).toBe('johndoe');
  });
});
