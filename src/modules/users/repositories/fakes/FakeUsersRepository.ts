import UserStatus from '@modules/users/infra/enums/UserStatus';

import IUsersRepository, {
  ISearchOptions,
} from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import ClientUsers from '@modules/users/infra/typeorm/entities/ClientUsers';

class FakeUsersRepository implements IUsersRepository {
  private documents: User[] = [];

  public async create(docData: ICreateUserDTO): Promise<User> {
    const newDoc = new User();

    const id = Math.ceil(Math.random() * 100);

    let clientList: ClientUsers[] | undefined;

    if (docData.idClient) {
      clientList = [
        {
          id_cliente: docData.idClient,
          id_usuario: id,
        },
      ];
    }

    Object.assign(
      newDoc,
      {
        id,
        clientList,
      },
      docData,
    );
    this.documents.push(newDoc);

    return newDoc;
  }

  public async find({ id_cliente, search }: ISearchOptions): Promise<User[]> {
    const regEx = new RegExp(`.*${search || ''}.*`, 'i');

    return this.documents.filter(
      doc =>
        doc.clientList?.find(cl => cl.id_cliente === id_cliente) &&
        doc.status !== UserStatus.DELETED &&
        (regEx.test(doc.display_name) || regEx.test(doc.pseudo_login)),
    );
  }

  public async findById(id: number): Promise<User | undefined> {
    return this.documents.find(
      doc => id === doc.id && doc.status !== UserStatus.DELETED,
    );
  }

  public async findByIds(ids: number[]): Promise<User[]> {
    const foundList: User[] = [];

    ids.forEach(id => {
      const document = this.documents.find(
        doc => id === doc.id && doc.status !== UserStatus.DELETED,
      );

      if (document) {
        foundList.push(document);
      }
    });

    return foundList;
  }

  public async findByLogin(pseudo_login: string): Promise<User | undefined> {
    return this.documents.find(
      doc =>
        pseudo_login === doc.pseudo_login && doc.status !== UserStatus.DELETED,
    );
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.documents.find(
      doc => email === doc.email && doc.status !== UserStatus.DELETED,
    );
  }

  public async update(data: Partial<User>): Promise<User> {
    const index = this.documents.findIndex(
      doc => doc.id === data.id && doc.status !== UserStatus.DELETED,
    );

    const updated = Object.assign(this.documents[index], data);

    this.documents.splice(index, 1, updated);

    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const document = this.documents.find(
      doc => doc.id === id && doc.status !== UserStatus.DELETED,
    );

    if (!document) {
      return false;
    }

    document.status = UserStatus.DELETED;

    return true;
  }
}

export default FakeUsersRepository;
