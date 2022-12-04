import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import GetUserService from './GetUserService';

let fakeUsersRepository: FakeUsersRepository;

let getUser: GetUserService;

describe('GetUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    getUser = new GetUserService(fakeUsersRepository);
  });

  it('should be able to get a user by id', async () => {
    const user = await fakeUsersRepository.create({
      display_name: 'John Doe',
      pseudo_login: 'johndoe',
      password: '123456',
      email: 'johndoe@example.com',
      idClient: 17,
    });

    const foundUser = await getUser.execute(user.id);

    expect(foundUser).toHaveProperty('id');
  });
});
