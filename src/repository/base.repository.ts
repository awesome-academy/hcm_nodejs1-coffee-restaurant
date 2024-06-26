import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  protected constructor(entity: EntityTarget<T>) {
    super(entity, AppDataSource.createEntityManager());
  }
}
