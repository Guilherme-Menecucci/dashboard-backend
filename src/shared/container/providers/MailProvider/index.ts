import EtherealMailProvider from './implementations/EtherealMailProvider';
import NodemailerMailProvider from './implementations/NodemailerMailProvider';

export default {
  ethereal: EtherealMailProvider,
  nodemailer: NodemailerMailProvider,
};
