export class CreateAccountDto {
  id?: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  token_type?: string | null;
  scope?: string | null;

  email?: string | null;
  password?: string | null;
}
