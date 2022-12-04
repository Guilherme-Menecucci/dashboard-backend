interface IMailConfig {
  driver: 'ethereal' | 'nodemailer';

  defaults: {
    transport: {
      host: string;
      port: number;
      secure: boolean;
      ignoreTLS: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    transport: {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      ignoreTLS: process.env.MAIL_IGNORETLS === 'true',
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    },
    from: {
      name: 'Equipe Oversee',
      email: 'envio@vconf.oversee.com.br',
    },
  },
} as IMailConfig;
