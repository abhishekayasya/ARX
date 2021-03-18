import {TestBed} from '@angular/core/testing';
import {DropdownDirectiveDirective} from './dropdown-directive.directive';

describe('Directive: DropdownDirectiveDirective', () => {
    const directive = DropdownDirectiveDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownDirectiveDirective]
    });
  });
  it('should create an instance', () => {
    expect(DropdownDirectiveDirective).toBeTruthy();
  });
});
