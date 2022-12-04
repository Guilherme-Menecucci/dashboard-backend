import ITopicsRepository, {
  ISearchOptions,
} from '@modules/topics/repositories/ITopicsRepository';
import ICreateTopicDTO from '@modules/topics/dtos/ICreateTopicDTO';
import Topic from '@modules/topics/infra/typeorm/entities/Topic';

class FakeTopicsRepository implements ITopicsRepository {
  private documents: Topic[] = [];

  public async create(docData: ICreateTopicDTO): Promise<Topic> {
    const newDoc = new Topic();

    const id = Math.ceil(Math.random() * 100);

    Object.assign(newDoc, { id }, docData);
    this.documents.push(newDoc);

    return newDoc;
  }

  public async find({ search }: ISearchOptions): Promise<Topic[]> {
    const regEx = new RegExp(`.*${search || ''}.*`, 'i');

    return this.documents.filter(doc => regEx.test(doc.title));
  }

  public async findById(id: number): Promise<Topic | undefined> {
    return this.documents.find(doc => id === doc.id);
  }

  public async update(data: Partial<Topic>): Promise<Topic> {
    const index = this.documents.findIndex(doc => doc.id === data.id);

    const updated = Object.assign(this.documents[index], data);

    this.documents.splice(index, 1, updated);

    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const document = this.documents.find(doc => doc.id === id);

    if (!document) {
      return false;
    }

    return true;
  }
}

export default FakeTopicsRepository;
