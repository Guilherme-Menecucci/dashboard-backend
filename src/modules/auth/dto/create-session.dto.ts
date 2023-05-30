export class CreateSessionDto {
  id?: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}
