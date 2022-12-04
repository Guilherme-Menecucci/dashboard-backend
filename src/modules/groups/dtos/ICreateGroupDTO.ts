import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateGroupDTO {
  display_name: string;

  id_cliente: number;

  userList: User[];
}
