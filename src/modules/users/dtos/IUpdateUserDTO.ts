type IUpdateUserDTO = {
  id: number;
  display_name: string;
  pseudo_login: string;
  email: string;
  old_password?: string;
  password?: string;
  status?: number;
  observacao?: string;
  mobile_phone?: string;
  work_phone?: string;
  home_phone?: string;
  is_active?: number;
  is_avulso?: number;
};

export default IUpdateUserDTO;
