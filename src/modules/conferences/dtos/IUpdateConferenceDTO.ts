type IUpdateUserDTO = {
  id: number;

  id_grupo: number;

  titulo: string;

  status?: number;

  salvarPadrao?: string;
};

export default IUpdateUserDTO;
