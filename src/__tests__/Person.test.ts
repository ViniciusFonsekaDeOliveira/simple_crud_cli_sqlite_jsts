import { Person } from "@/domain/Person";

describe("Testing Person Class", () => {
  let person: Person;
  const uuid = "4c4a7f0d-15ad-43b1-b97e-ac89c306f626";
  const firstname = "Person1";
  const lastname = "Test";
  const nickname = "persontest";
  const email = "test@test.com";

  beforeEach(() => {
    person = new Person(uuid, firstname, lastname, nickname, email);
  });

  it("Should construct a person object and allow to get person attributes correctly", () => {
    expect(person.get_uuid()).toBe(uuid);
    expect(person.get_firstname()).toBe(firstname);
    expect(person.get_lastname()).toBe(lastname);
    expect(person.get_nickname()).toBe(nickname);
    expect(person.get_email()).toBe(email);
  });

  test.each`
    firstname     | expectedName
    ${"Vinícius"} | ${"Vinícius"}
    ${"Bob"}      | ${"Bob"}
    ${"Ted"}      | ${"Ted"}
  `("Deve obter o nome $firstname", ({ firstname, expectedName }) => {
    person.set_firstname(firstname);
    expect(person.get_firstname()).toBe(expectedName);
  });

  it("Should return a record from class instance", () => {
    const result: Record<string, string> = {
      uuid: person.get_uuid(),
      firstname: person.get_firstname(),
      lastname: person.get_lastname(),
      nickname: person.get_nickname(),
      email: person.get_email(),
    };
    expect(person.toRecord()).toStrictEqual(result);
  });
});
