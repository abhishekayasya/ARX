export class LoginData {

  private username: string;
  private password: string;
  private primeId: string;

  constructor(username: string, password: string, primeId: string) {
    this.username = username;
    this.password = password;
    this.primeId = primeId;
  }
  get Loign(): string {
    return this.username;
  }

  get Password(): string {
    return this.password;
  }

  get Source(): string {
   return this.primeId;
  }

}
