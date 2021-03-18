import { TestBed } from "@angular/core/testing";
import { PhoneMaskDirective } from "./phone-mask.directive";

describe("Directive: PhoneMaskDirective", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneMaskDirective]
    });
  });
  it("should create an instance", () => {
    expect(PhoneMaskDirective).toBeTruthy();
  });
});
