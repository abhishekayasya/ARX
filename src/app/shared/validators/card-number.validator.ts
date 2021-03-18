import { AbstractControl, ValidatorFn } from '@angular/forms';
import { CARD_TYPES } from '@app/config/cards.constant';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class ValidateCardNumber {
    private card_type;
    private subject = new Subject<any>();
    constructor() {
    }

    validate(): ValidatorFn {
        return (control: AbstractControl): any => {
            if (control.value !== undefined && control.value !== null && control.value.toString() !== '') {
                const value = this.normalize(control.value);
                if (!this.get_card_type(value)) {
                    this.subject.next({type : null});
                    return {
                        invalidType: {
                            valid: false
                        }
                    };
                }
                this.subject.next({type : this.card_type});

                if (!this.is_valid_length(value)) {
                    return {
                        invalidLength: {
                            valid: false
                        }
                    };
                }

                if (!this.is_valid_luhn(value)) {
                    return {
                        invalidNumber: {
                            valid: false
                        }
                    };
                }
            } else {
                this.subject.next({type : null});
            }
            return null;
        };
    }

    getCardType(): Observable<any> {
        return this.subject.asObservable();
    }

    private normalize(number) {
        return number.replace(/[ -]/g, '');
    }

    private get_card_type(number) {
        let k, len1, r, types;
        types = CARD_TYPES;
        for (k = 0, len1 = types.length; k < len1; k++) {
            this.card_type = types[k];
            // tslint:disable-next-line: no-use-before-declare
            r = Range.rangeWithString(this.card_type.range);
            if (r.match(number)) {
                return this.card_type;
            }
        }
        return null;
    }

    private is_valid_luhn(number) {
        let digit, k, len1, n, ref1, sum;
        sum = 0;
        ref1 = number.split('').reverse();
        for (n = k = 0, len1 = ref1.length; k < len1; n = ++k) {
            digit = ref1[n];
            digit = +digit;
            if (n % 2) {
                digit *= 2;
                if (digit < 10) {
                    sum += digit;
                } else {
                    sum += digit - 9;
                }
            } else {
                sum += digit;
            }
        }
        return sum % 10 === 0;
    }

    private is_valid_length (number) {
        const len = number.length;
        return this.card_type.valid_length.indexOf(len) >= 0;
    }

}



class Trie {
    trie;
    constructor() {
        this.trie = {};
    }

    push(value) {
        let char, i, j, len, obj, ref, results;
        value = value.toString();
        obj = this.trie;
        ref = value.split('');
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            char = ref[i];
            if (obj[char] == null) {
                if (i === (value.length - 1)) {
                    obj[char] = null;
                } else {
                    obj[char] = {};
                }
            }
            results.push(obj = obj[char]);
        }
        return results;
    }

    find(value) {
        let char, i, j, len, obj, ref;
        value = value.toString();
        obj = this.trie;
        ref = value.split('');
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            char = ref[i];
            if (obj.hasOwnProperty(char)) {
                if (obj[char] === null) {
                    return true;
                }
            } else {
                return false;
            }
            obj = obj[char];
        }
    }
}

class Range {
    trie: Trie;
    constructor(trie1) {
        this.trie = trie1;
        if (this.trie.constructor !== Trie) {
            throw Error('Range constructor requires a Trie parameter');
        }
    }

    static rangeWithString(ranges) {
        let j, k, len, n, r, range, ref, ref1, trie;
        if (typeof ranges !== 'string') {
            throw Error('rangeWithString requires a string parameter');
        }
        ranges = ranges.replace(/ /g, '');
        ranges = ranges.split(',');
        trie = new Trie();
        for (j = 0, len = ranges.length; j < len; j++) {
            range = ranges[j];
            if (r = range.match(/^(\d+)-(\d+)$/)) {
                for (n = k = ref = r[1], ref1 = r[2]; ref <= ref1 ? k <= ref1 : k >= ref1; n = ref <= ref1 ? ++k : --k) {
                    trie.push(n);
                }
            } else if (range.match(/^\d+$/)) {
                trie.push(range);
            } else {
                throw Error('Invalid range \'' + r + '\'');
            }
        }
        return new Range(trie);
    }

    match(number) {
        return this.trie.find(number);
    }
}
