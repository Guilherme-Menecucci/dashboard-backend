export class CreateSessionDto {
  id?: string;
  token: string;
  userId: string;
  expires: Date;
}
