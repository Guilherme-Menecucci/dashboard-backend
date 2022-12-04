import ICreateGroupDTO from '../../dtos/ICreateGroupDTO';
import IGroupsRepository, { ISearchOptions } from '../IGroupsRepository';
import Group from '../../infra/typeorm/entities/Group';

class FakeGroupsRepository implements IGroupsRepository {
  private documents: Group[] = [];

  public async create(docData: ICreateGroupDTO): Promise<Group> {
    const newDoc = new Group();

    const id = Math.ceil(Math.random() * 10 ** 11) + 1;

    Object.assign(newDoc, { id }, docData);
    this.documents.push(newDoc);

    return newDoc;
  }

  public async find({ id_cliente, search }: ISearchOptions): Promise<Group[]> {
    const regEx = new RegExp(`.*${search || ''}.*`, 'i');

    return this.documents.filter(
      doc => doc.id_cliente === id_cliente && regEx.test(doc.display_name),
    );
  }

  public async findById(id: number): Promise<Group | undefined> {
    return this.documents.find(doc => id === doc.id);
  }

  public async findByDisplayName(
    displayName: string,
  ): Promise<Group | undefined> {
    return this.documents.find(doc => doc.display_name === displayName);
  }

  public async update(data: Partial<Group>): Promise<Group> {
    const index = this.documents.findIndex(doc => doc.id === data.id);

    const updated = Object.assign(this.documents[index], data);

    this.documents.splice(index, 1, updated);

    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const index = this.documents.findIndex(doc => doc.id === id);

    return this.documents.splice(index, 1).length >= 1;
  }
}

export default FakeGroupsRepository;
