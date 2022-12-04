import UserStatus from '@modules/users/infra/enums/UserStatus';

export default interface ICreateUserDTO {
  email: string;

  password: string;

  pseudo_login: string;

  login_name?: string;

  display_name: string;

  idClient?: number;

  observacao?: string;

  mobile_phone?: string;

  work_phone?: string;

  home_phone?: string;

  status?: UserStatus;

  is_active?: number;

  is_avulso?: number;
}
