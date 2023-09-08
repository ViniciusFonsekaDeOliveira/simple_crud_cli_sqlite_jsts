import { SQLRepository } from "../repository/SQLRepository";
import * as fs from "fs";
import { Person } from "../domain/Person";
import sqlite3 from "sqlite3";
import { SqliteRepository } from "../repository/SqliteRepository";

class Seeder {
  private readonly repository: SQLRepository;

  constructor(repository: SQLRepository) {
    this.repository = repository;
  }

  populateDatabaseWith(fileNameOrPath: string): void {
    //abrir o arquvio
    fs.readFile(fileNameOrPath, "utf8", async (error, data) => {
      if (error) {
        throw new Error(`Erro ao abrir o arquivo: ${error.message}`);
      }
      //preparing the file data
      const delimiter = ";";
      const fileLines: string[] = data.split("\n");
      const header = fileLines.shift(); //Remove o header
      //preparing the database to receive it
      const tableName = "Person";
      const tableSchema: Record<string, string> = {
        uuid: "TEXT PRIMARY KEY",
        firstname: "TEXT",
        lastname: "TEXT",
        nickname: "TEXT",
        email: "TEXT",
      };
      await this.repository.createTable(tableName, tableSchema);
      //data persistence
      console.log("Inserindo dados do arquivo no banco de dados...");
      for (const line of fileLines) {
        const [uuid, firstname, lastname, nickname, email] =
          line.split(delimiter);

        const person = new Person(uuid, firstname, lastname, nickname, email);
        await this.repository.insert("Person", person.toRecord());
      }
      console.log("Dados inseridos com sucesso!");
      this.repository.closeConnection();
    });
  }
}

const main = () => {
  const connection = new sqlite3.Database("mydb.db");
  const repository = new SqliteRepository(connection);
  const seeder = new Seeder(repository);

  seeder.populateDatabaseWith("../assets/fakedata2.csv");
};

main();
