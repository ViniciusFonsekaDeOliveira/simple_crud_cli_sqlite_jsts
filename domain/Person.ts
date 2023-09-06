export class Person {
  private _uuid: string;
  private _firstname: string;
  private _lastname: string;
  private _nickname: string;
  private _email: string;

  constructor(
    uuid: string,
    firstname: string,
    lastname: string,
    nickname: string,
    email: string
  ) {
    this._uuid = uuid;
    this._firstname = firstname;
    this._lastname = lastname;
    this._nickname = nickname;
    this._email = email;
  }

  get_uuid(): string {
    return this._uuid;
  }

  get_firstname(): string {
    return this._firstname;
  }

  get_lastname(): string {
    return this._lastname;
  }

  get_nickname(): string {
    return this._nickname;
  }

  get_email(): string {
    return this._email;
  }

  set_uuid(uuid: string): void {
    this._uuid = uuid;
  }

  set_firstname(firstname: string): void {
    this._firstname = firstname;
  }

  set_lastname(lastname: string): void {
    this._lastname = lastname;
  }

  set_nickname(nickname: string): void {
    this._nickname = nickname;
  }

  set_email(email: string): void {
    this._email = email;
  }

  toRecord(): Record<string, string> {
    return {
      uuid: this.get_uuid(),
      firstname: this.get_firstname(),
      lastname: this.get_lastname(),
      nickname: this.get_nickname(),
      email: this.get_email(),
    };
  }
}
