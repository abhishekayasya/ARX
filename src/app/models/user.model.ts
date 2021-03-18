import {
  Address,
  HeaderModel,
  ProfileModel,
  ProfileInfoModel,
  ProfileIndModel
} from '@app/models';

export class ArxUser {
  profile: ProfileModel;

  private _firstName: string;
  private _lastName: string;
  private _id: string;
  private _userName: string;
  private _phoneType: string;
  private _phoneNumber: string;
  private _gender: string;
  private _email: string;
  private _dateOfBirth: string;
  private _areaCode: string;
  private _address: Address;
  private _isSSO: boolean;
  private _isRxHIPAAUser: boolean;
  private _isRxConsentUser: boolean;
  private _isRxUser: boolean;
  private _isRxAuthenticatedUser: boolean;
  private _isPatIdExists: boolean;
  private _isQRUser: boolean;
  private _loggedIn: string;
  private _userType: string;
  private _headerInfo: HeaderModel;
  private _isReg1ExceptionUser: boolean;
  private _isReg2ExceptionUser: boolean;

  constructor(id: string, isSSO: boolean = false) {
    this._id = id;
    this._isSSO = isSSO;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(firstName: string) {
    this._firstName = firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(lastName: string) {
    this._lastName = lastName;
  }

  get id(): string {
    return this._id;
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get phoneType(): string {
    return this._phoneType;
  }

  set phoneType(value: string) {
    this._phoneType = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get gender(): string {
    return this._gender;
  }

  set gender(value: string) {
    this._gender = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get dateOfBirth(): string {
    return this._dateOfBirth;
  }

  set dateOfBirth(value: string) {
    this._dateOfBirth = value;
  }

  get areaCode(): string {
    return this._areaCode;
  }

  set areaCode(value: string) {
    this._areaCode = value;
  }

  get loggedIn(): string {
    return this._loggedIn;
  }

  get userType(): string {
    return this._userType;
  }

  set userType(value: string) {
    this._userType = value;
  }

  set loggedIn(value: string) {
    this._loggedIn = value;
  }

  get address(): Address {
    return this._address;
  }

  set address(value: Address) {
    this._address = value;
  }

  build(userJson: JSON): void {
    Object.assign(this, userJson);
  }

  buildProfile(json: JSON): void {
    Object.assign(this.profile, json);
  }

  get headerInfo(): HeaderModel {
    return this._headerInfo;
  }

  set headerInfo(headerInfo: HeaderModel) {
    this._headerInfo = headerInfo;
  }

  get isSSO(): boolean {
    return this._isSSO;
  }

  set isSSO(value: boolean) {
    this._isSSO = value;
  }

  get isRxHIPAAUser(): boolean {
    return this._isRxHIPAAUser;
  }

  set isRxHIPAAUser(value: boolean) {
    this._isRxHIPAAUser = value;
  }

  get isRxConsentUser(): boolean {
    return this._isRxConsentUser;
  }

  set isRxConsentUser(value: boolean) {
    this._isRxConsentUser = value;
  }

  get isReg1ExceptionUser(): boolean {
    return this._isReg1ExceptionUser;
  }

  set isReg1ExceptionUser(value: boolean) {
    this._isReg1ExceptionUser = value;
  }

  get isReg2ExceptionUser(): boolean {
    return this._isReg2ExceptionUser;
  }

  set isReg2ExceptionUser(value: boolean) {
    this._isReg2ExceptionUser = value;
  }

  get isRxUser(): boolean {
    return this._isRxUser;
  }

  set isRxUser(value: boolean) {
    this._isRxUser = value;
  }

  get isRxAuthenticatedUser(): boolean {
    return this._isRxAuthenticatedUser;
  }

  set isRxAuthenticatedUser(value: boolean) {
    this._isRxAuthenticatedUser = value;
  }

  get isPatIdExists(): boolean {
    return this._isPatIdExists;
  }

  set isPatIdExists(value: boolean) {
    this._isPatIdExists = value;
  }

  get isQRUser(): boolean {
    return this._isQRUser;
  }

  set isQRUser(value: boolean) {
    this._isQRUser = value;
  }
}
