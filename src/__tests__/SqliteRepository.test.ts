import { SqliteRepository } from "@/repository/SqliteRepository";
import sqlite from "sqlite3";

describe("Sqlite Repository Testing", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockGetConnection = jest.fn();
  const mockCreateTable = jest.fn();
  const mockFindAll = jest.fn();
  const mockFindOne = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockdelete = jest.fn();
  const mockCloseConnection = jest.fn();

  jest.mock("sqlite3", () => {
    return {
      Database: jest.fn().mockImplementation(() => ({
        close: jest.fn(),
        run: jest.fn(),
        exec: jest.fn(),
        get: jest.fn(),
        all: jest.fn(),
      })),
    };
  });

  jest.mock("@/repository/SqliteRepository", () => {
    return jest.fn().mockImplementation(() => ({
      getConnection: mockGetConnection,
      createTable: mockCreateTable,
      findAll: mockFindAll,
      findOne: mockFindOne,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockdelete,
      closeConnection: mockCloseConnection,
    }));
  });

  it("Should create a mocked SqliteRepository instance with a mocked instance of sqlite.Database connection", () => {
    const mockedConnection = new sqlite.Database("test.db");
    const mockedRepository = new SqliteRepository(mockedConnection);

    expect(mockedRepository).toBeDefined();
  });

  describe("Testing Sqlite Repository Methods", () => {
    const mockedConnection = new sqlite.Database("test.db");
    const mockedRepository = new SqliteRepository(mockedConnection);

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("Should create a table correctly", async () => {
      const tableName = "test";
      const tableSchema = {
        id: "INTEGER PRIMARY KEY",
        test_name: "TEXT",
      };

      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});

      const createTableSpy = jest.spyOn(mockedRepository, "createTable");

      const connectionSpy = jest.spyOn(mockedConnection, "exec");

      await mockedRepository.createTable(tableName, tableSchema);

      expect(createTableSpy).toHaveBeenCalledWith(tableName, tableSchema);

      //   expect(connectionSpy).toBeCalledWith(
      //     "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY,test_name TEXT)",
      //     expect.any(Function)
      //   );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Tabela test criada com sucesso!"
      );
    });
  });
});
