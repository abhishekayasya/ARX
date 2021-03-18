export class Address {

  private city: string;
  private state: string;
  private zipCode: string;
  private street: string;

  constructor(
    city: string,
    state: string,
    zipCode: string,
    street: string

  ) {
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.street = street;

  }

  get City(): string {
    return this.city;
  }

  get State(): string {
    return this.state;
  }

  get ZipCode(): string {
    return this.zipCode;
  }

  get Street(): string {
    return this.street;
  }


}
