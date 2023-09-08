import readline from "readline";
import {
  deletePerson,
  exitProgram,
  listingAllAlphabetically,
  personRegister,
  rlQuestionAsync,
  searchPerson,
  uptadePerson,
} from "./cli-utils";

const cli = async () => {
  const menu =
    "Bem-vindo(a) ao SIMPLE CRUD CLI JSTS\n\n" +
    "Escolha uma operação para começar:\n" +
    "(1) Cadastrar uma pessoa\n" +
    "(2) Listar todas em ordem alfabética\n" +
    "(3) Procurar uma pessoa\n" +
    "(4) Atualizar o registro de uma pessoa\n" +
    "(5) Deletar uma pessoa\n" +
    "(6) Encerrar o programa\n\n" +
    "Digite sua opção: ";

  let option = 0;

  do {
    option = parseInt(await rlQuestionAsync(menu));

    switch (option) {
      case 1:
        await personRegister();
        break;
      case 2:
        await listingAllAlphabetically();
        break;
      case 3:
        await searchPerson();
        break;
      case 4:
        await uptadePerson();
        break;
      case 5:
        await deletePerson();
        break;
      case 6:
        exitProgram();
        return;
      default:
        console.log("Opção inválida!");
        exitProgram();
    }
  } while (option >= 1 && option <= 5);
};

cli();
