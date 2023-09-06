import { Database } from "sqlite3";
import { getWhereClauseConditions } from "./repository-utils";
import { SQLRepository } from "./SQLRepository";

export class SqliteRepository implements SQLRepository {
  private connection: Database;

  constructor(connection: Database) {
    this.connection = connection;
  }

  getConnection(): Database {
    return this.connection;
  }

  createTable(
    tableName: string,
    table_schema: Record<string, string>
  ): Promise<void> {
    const schema_columns = Object.keys(table_schema)
      .map((column) => `${column} ${table_schema[column]}`)
      .join(",");
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
      ${schema_columns}
    )`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.exec(query, (err) => {
        if (err) reject(err);
        else {
          console.log(`Tabela ${tableName} criada com sucesso!`);
          resolve();
        }
      });
    });
  }

  findAll<T>(tableName: string, fields: string = "*"): Promise<T[]> {
    const query = `SELECT ${fields} FROM ${tableName}`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.all<T>(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  findOne<T>(
    tableName: string,
    dataToSearch: Record<string, string>,
    fields: string = "*"
  ): Promise<T> {
    const [clauseConditions, clauseValues] =
      getWhereClauseConditions(dataToSearch);
    const query = `SELECT ${fields} FROM ${tableName} WHERE ${clauseConditions}`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.get<T>(query, (err, row) => {
        if (err)
          reject(new Error(`Erro ao encontrar um objeto: ${err.message}`));
        else resolve(row);
      });
    });
  }

  insert(
    tableName: string,
    dataToInsert: Record<string, string>
  ): Promise<void> {
    const columns = Object.keys(dataToInsert).join(",");
    const placeholders = Object.keys(dataToInsert)
      .map((column) => "?")
      .join(",");
    const valuesToInsert = Object.values(dataToInsert);
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.run(query, valuesToInsert, (err) => {
        if (err) reject(new Error(`Erro ao inserir dados: ${err.message}`));
        else resolve();
      });
    });
  }

  update(
    tableName: string,
    updatedData: Record<string, string>,
    dataIdentifier: Record<string, string>
  ): Promise<void> {
    const columnsToUpdate = Object.keys(updatedData)
      .map((column) => `${column}=?`)
      .join(",");
    const [clauseConditions, clauseValues] =
      getWhereClauseConditions(dataIdentifier);
    const valuesToUpdate = [...Object.values(updatedData), ...clauseValues];
    const query = `UPDATE ${tableName} SET ${columnsToUpdate} WHERE ${clauseConditions}`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.run(query, valuesToUpdate, (err) => {
        if (err)
          reject(new Error(`Erro ao atualizar registro: ${err.message}`));
        else resolve();
      });
    });
  }

  delete(
    tableName: string,
    dataIdentifier: Record<string, string>
  ): Promise<void> {
    const [clauseConditions, clauseValues] =
      getWhereClauseConditions(dataIdentifier);
    const query = `DELETE FROM ${tableName} WHERE ${clauseConditions}`;
    const cursor = this.getConnection();
    return new Promise((resolve, reject) => {
      cursor.run(query, clauseValues, (err) => {
        if (err) reject(new Error(`Erro ao deletar registro: ${err.message}`));
        else resolve();
      });
    });
  }

  closeConnection(): void {
    if (this.getConnection()) {
      console.log("Conexão encerrada com sucesso!");
      this.connection.close();
    }
  }
}
