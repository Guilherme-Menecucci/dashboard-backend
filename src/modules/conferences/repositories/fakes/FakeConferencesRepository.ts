import { v4 } from 'uuid';

import ConferenceStatus from '@modules/conferences/infra/enums/ConferenceStatus';

import IConferencesRepository, {
  ISearchOptions,
} from '@modules/conferences/repositories/IConferencesRepository';
import ICreateConferenceDTO from '@modules/conferences/dtos/ICreateConferenceDTO';
import Conference from '@modules/conferences/infra/typeorm/entities/Conference';

class FakeConferencesRepository implements IConferencesRepository {
  private documents: Conference[] = [];

  public async create(docData: ICreateConferenceDTO): Promise<Conference> {
    const newDoc = new Conference();

    const id = Math.ceil(Math.random() * 100);

    Object.assign(
      newDoc,
      {
        id,
        token: v4(),
        id_conference: 0,
      },
      docData,
    );
    this.documents.push(newDoc);

    return newDoc;
  }

  public async find({
    id_cliente,
    search,
  }: ISearchOptions): Promise<Conference[]> {
    const regEx = new RegExp(`.*${search || ''}.*`, 'i');

    return this.documents.filter(
      doc =>
        doc.id_cliente === id_cliente &&
        doc.status !== ConferenceStatus.DELETED &&
        regEx.test(doc.titulo),
    );
  }

  public async findById(id: number): Promise<Conference | undefined> {
    return this.documents.find(
      doc => id === doc.id && doc.status !== ConferenceStatus.DELETED,
    );
  }

  public async update(data: Partial<Conference>): Promise<Conference> {
    const index = this.documents.findIndex(
      doc => doc.id === data.id && doc.status !== ConferenceStatus.DELETED,
    );

    const updated = Object.assign(this.documents[index], data);

    this.documents.splice(index, 1, updated);

    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const document = this.documents.find(
      doc => doc.id === id && doc.status !== ConferenceStatus.DELETED,
    );

    if (!document) {
      return false;
    }

    document.status = ConferenceStatus.DELETED;

    return true;
  }
}

export default FakeConferencesRepository;
