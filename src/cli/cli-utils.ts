import * as readline from "readline";
import sqlite3 from "sqlite3";
import { SqliteRepository } from "../repository/SqliteRepository";
import { v4 as uuidv4 } from "uuid";
import { Person } from "../domain/Person";
import { exit } from "process";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const rlQuestionAsync = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.prompt();
      resolve(answer);
    });
  });
};

export const rlClose = () => {
  rl.close();
};

export const personRegister = async () => {
  console.clear();
  const firstname = await rlQuestionAsync("Digite o primeiro nome da pessoa: ");
  const lastname = await rlQuestionAsync("Digite o último nome da pessoa: ");
  const nickname = await rlQuestionAsync("Digite o apelido da pessoa: ");
  const email = await rlQuestionAsync("Digite o email da pessoa: ");
  const dataToInsert: Record<string, string> = {
    uuid: uuidv4().toString(),
    firstname: firstname,
    lastname: lastname,
    nickname: nickname,
    email: email,
  };
  const dbName = "../mydb.db";
  const tableName = "Person";
  const connection = new sqlite3.Database(dbName);
  const repository = new SqliteRepository(connection);

  await repository.insert(tableName, dataToInsert);
  console.log("Pessoa cadastrada com sucesso!");
  repository.closeConnection();
};

export const listingAllAlphabetically = async () => {
  console.clear();
  const dbName = "../mydb.db";
  const tableName = "Person";
  const connection = new sqlite3.Database(dbName);
  const repository = new SqliteRepository(connection);

  const results = await repository.findAll<Person>(tableName);
  //results não vem com instancias do tipo Person realmente, ele vem com instancias do tipo object.
  //por esse motivo é necessário converter o resultado retornado do banco explicitamente antes de ordenar.
  console.log("Listando todas as pessoas");
  const personList: Person[] = [];
  for (const object of results) {
    const [uuid, firstname, lastname, nickname, email] = Object.values(object);
    const newPerson = new Person(uuid, firstname, lastname, nickname, email);
    personList.push(newPerson);
  }

  //ordenando alfabeticamente a lista de todas as pessoas
  console.log("Ordenando as pessoas alfabeticamente...");
  personList.sort((personA: Person, personB: Person): number => {
    const nameA = personA.get_firstname();
    const nameB = personB.get_firstname();

    if (nameA < nameB) return -1;
    if (nameB < nameA) return 1;
    return 0;
  });

  //imprimindo o resultado da ordenação
  for (const person of personList) {
    console.log(person.get_firstname());
  }

  repository.closeConnection();
};

export const searchPerson = async () => {
  console.clear();
  const firstname = await rlQuestionAsync("Digite o primeiro nome da pessoa: ");
  const lastname = await rlQuestionAsync("Digite o último nome da pessoa: ");
  const dataToSearch: Record<string, string> = {
    firstname: firstname.trim(),
    lastname: lastname.trim(),
  };

  const dbName = "../mydb.db";
  const tableName = "Person";
  const connection = new sqlite3.Database(dbName);
  const repository = new SqliteRepository(connection);

  const personObject = await repository.findOne<Person>(
    tableName,
    dataToSearch
  );

  if (!personObject) {
    console.log("Pessoa não encontrada!");
    return;
  }

  const [uuid, firstname1, lastname1, nickname, email] =
    Object.values(personObject);
  const foundPerson = new Person(uuid, firstname1, lastname1, nickname, email);

  console.log(
    `A pessoa ${foundPerson.get_firstname()} foi encontrada com sucesso!\n`
  );
  console.log(foundPerson.toString());

  repository.closeConnection();
};

export const uptadePerson = async () => {
  console.clear();
  const firstname = await rlQuestionAsync(
    "Digite o primeiro nome da pessoa que você deseja atualizar: "
  );
  const lastname = await rlQuestionAsync(
    "Digite o último nome da pessoa que você deseja atualizar: "
  );

  const dataIdentifier: Record<string, string> = {
    firstname: firstname.trim(),
    lastname: lastname.trim(),
  };

  const dbName = "../mydb.db";
  const tableName = "Person";
  const connection = new sqlite3.Database(dbName);
  const repository = new SqliteRepository(connection);

  const foundPerson = await repository.findOne(tableName, dataIdentifier);

  if (!foundPerson) {
    console.log("A pessoa informada não existe. Tente novamente.");
    return;
  }

  const fieldToUpdate = await rlQuestionAsync(
    "Digite o campo que você deseja atualizar: "
  );
  // caso o campo informado não exista.
  const expectedFields = ["firstname", "lastname", "nickname", "email"];
  if (!expectedFields.includes(fieldToUpdate)) {
    console.log(`O campo solicitado não existe! Tente novamente.`);
    return;
  }

  const updatedField = await rlQuestionAsync(
    "Digite o novo valor para o campo informado: "
  );

  const updatedData = buildRecordBasedOnField(
    fieldToUpdate.trim(),
    updatedField.trim()
  );

  if (!updatedData) {
    console.log(
      "Ocorreu um erro ao montar o registro de atualização para o campo solicitado!"
    );
    return;
  }

  await repository.update(tableName, updatedData, dataIdentifier);
  console.log("Dados atualizados com sucesso!");

  repository.closeConnection();
};

export const deletePerson = async () => {
  console.clear();
  const firstname = await rlQuestionAsync(
    "Digite o primeiro nome da pessoa que você deseja deletar: "
  );
  const lastname = await rlQuestionAsync(
    "Digite o último nome da pessoa que você deseja deletar: "
  );
  const dataIdentifier: Record<string, string> = {
    firstname: firstname,
    lastname: lastname,
  };

  const dbName = "../mydb.db";
  const tableName = "Person";
  const connection = new sqlite3.Database(dbName);
  const repository = new SqliteRepository(connection);

  await repository.delete(tableName, dataIdentifier);
  console.log("Pessoa removida com sucesso!");

  repository.closeConnection();
};

export const exitProgram = () => {
  console.clear();
  console.log("Até a próxima!");
  rlClose();
  exit();
};

// export const pressAnyKeyToContinue = () => {
//   return new Promise<void>((resolve) => {
//     rl.question("Pressione enter para continuar...", () => {
//       rl.prompt();
//       resolve();
//     });
//   });
// };

const buildRecordBasedOnField = (
  fieldToUpdate: string,
  valueOfFieldToUpdate: string
): Record<string, string> | undefined => {
  switch (fieldToUpdate) {
    case "firstname":
      return {
        firstname: valueOfFieldToUpdate,
      };
    case "lastname":
      return {
        lastname: valueOfFieldToUpdate,
      };
    case "nickname":
      return {
        nickname: valueOfFieldToUpdate,
      };
    case "email":
      return {
        email: valueOfFieldToUpdate,
      };
    default:
      return undefined;
  }
};
