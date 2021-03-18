export class PasswordCheckData {

  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  get FirstName(): string {
    return this.firstName;
  }

  get LastName(): string {
    return this.lastName;
  }

  get Email(): string {
    return this.email;
  }

  get Password(): string {
    return this.password;
  }

}
