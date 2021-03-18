import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateConfigModel } from '@app/models/date-config.model';

export function ValidateDate(
  config: DateConfigModel,
  isSsoOrLiteReg: boolean = false
): ValidatorFn {
  return (control: AbstractControl): any => {
    let error = null;
    if (isSsoOrLiteReg) {
    } else if (
      control.value !== undefined &&
      control.value !== null &&
      control.value.toString() !== ''
    ) {
      const regex = !config.isCreditCardExpiryDate
        ? new RegExp('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')
        : new RegExp('(0[1-9]|1[012])[ /]([0-9]{2})$');

      if (regex.test(control.value.toString())) {
        // If date format is proper then validate date.
        const date = !config.isCreditCardExpiryDate
          ? new Date(control.value.toString())
          : new Date();
        if (isNaN(date.valueOf())) {
          // Not a valid date.
          error = {
            validDate: {
              valid: false
            }
          };
        } else if (config.isCreditCardExpiryDate) {
          const monthMatch = date.getMonth() + 1;
          // tslint:disable-next-line: radix
          const yearMatch = parseInt(
            new Date()
              .getFullYear()
              .toString()
              .substr(-2)
          );

          // tslint:disable-next-line: radix
          const userYear = parseInt(control.value.toString().substring(3, 5));
          // tslint:disable-next-line: radix
          const userMonth = parseInt(control.value.toString().substring(0, 2));

          if (userYear < yearMatch) {
            error = {
              validDate: {
                valid: false
              }
            };
          } else if (userYear === yearMatch) {
            if (userMonth < monthMatch) {
              error = {
                validDate: {
                  valid: false
                }
              };
            }
          }
        } else {
          const day = date.getDate();
          const year = date.getFullYear();
          let month = date.getMonth();

          // tslint:disable-next-line: radix
          const monthMatch = parseInt(control.value.toString().substring(0, 2));
          // tslint:disable-next-line: radix
          const yearMatch = parseInt(control.value.toString().substring(6, 10));
          // tslint:disable-next-line: radix
          const dayMatch = parseInt(control.value.toString().substring(3, 5));
          month++;

          if (day === dayMatch && month === monthMatch && year === yearMatch) {
            const maxMonth = new Date().getMonth() + 1;
            const maxDay = new Date().getDate();
            const maxYear = new Date().getFullYear();

            // validate DOB case
            if (config.isDob) {
              const minYear = new Date().getFullYear() - 118;
              // tslint:disable-next-line: no-shadowed-variable
              const maxYear = new Date().getFullYear();
              // tslint:disable-next-line: no-shadowed-variable
              const maxDay = new Date().getDate();
              // tslint:disable-next-line: no-shadowed-variable
              let  maxMonth = new Date().getMonth();
              maxMonth++;
              if (year < minYear || year > maxYear) {
                return {
                  validDate: {
                    valid: false
                  }
                };
              }

              if (month > maxMonth && year === maxYear) {
                return {
                  validDate: {
                    valid: false
                  }
                };
              }

              if (maxDay > day && month === maxMonth && year === maxYear) {
                return {
                  validDate: {
                    valid: false
                  }
                };
              }
              
              // validating age for given date of birth id minimum age is provided
              // validMinAge will the the error type to show message for field.
              if ( config.minAge && config.minAge > 0 ) {
                let age = Math.floor((new Date().getTime() - date.getTime()) / 3.15576e+10)
                if ( age < config.minAge ) {
                  return {
                    validMinAge: {
                      valid: false
                    }
                  };
                }
              }

            }

            // validate range

            // validating future date.
            if (
              year > new Date().getFullYear() &&
              !config.allowFuture &&
              !config.isDob &&
              config.range === ''
            ) {
              return {
                validDate: {
                  valid: false
                }
              };
            }

            // validating past date
            if (
              year < new Date().getFullYear() &&
              !config.allowPast &&
              !config.isDob &&
              config.range === ''
            ) {
              return {
                validDate: {
                  valid: false
                }
              };
            }

            if (month > maxMonth && year === maxYear) {
              return {
                validDate: {
                  valid: false
                }
              };
            }

            if (day > maxDay && month === maxMonth && year === maxYear) {
              return {
                validDate: {
                  valid: false
                }
              };
            }
          } else {
            return {
              validDate: {
                valid: false
              }
            };
          }
        }
      } else {
        return {
          validDate: {
            valid: false
          }
        };
      }
    }

    return error;
  };
}
