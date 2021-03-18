export interface ProfileModel {
    basicProfile: {
      dateOfBirth: string;
      email: string;
      userName: string;
      login: string;
      lastName: string;
      firstName: string;
      gender: string;
      memberSince: string;
      oldEmail: string;
      phone: Array<{
          number: string,
          phoneId: string,
          priority: string,
          type: string
      }>;

      securityQuestion: string;
      userType: string;
    };
    profileId: string;
    regType: string;
}
