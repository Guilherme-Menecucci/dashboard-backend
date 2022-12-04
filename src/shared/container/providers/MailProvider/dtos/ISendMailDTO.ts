import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact | IMailContact[];
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
