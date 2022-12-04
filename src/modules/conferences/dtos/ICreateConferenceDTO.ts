export default interface ICreateConferenceDTO {
  id_grupo: number;

  id_cliente: number;

  titulo: string;

  token?: string;

  salvarPadrao?: string;
}
