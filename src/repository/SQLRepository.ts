export interface SQLRepository {
  getConnection(): any;

  createTable(
    tableName: string,
    table_schema: Record<string, string>
  ): Promise<void>;

  findAll<T>(tableName: string, fields: string): Promise<T[]>;

  findOne<T>(
    tableName: string,
    dataToSearch: Record<string, string>,
    fields: string
  ): Promise<T>;

  insert(
    tableName: string,
    dataToInsert: Record<string, string>
  ): Promise<void>;

  update(
    tableName: string,
    updatedData: Record<string, string>,
    dataIdentifier: Record<string, string>
  ): Promise<void>;

  delete(
    tableName: string,
    dataIdentifier: Record<string, string>
  ): Promise<void>;

  closeConnection(): void;
}
