import { TestBed, async } from "@angular/core/testing";
import { AppTestingModule } from "../../../../tests/app.testing.module";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonUtil } from "./common-util.service";

describe("Common Util service", () => {
  let _common: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _common = TestBed.get(CommonUtil);
      });
  }));

  it("Check Service instance is available", () => {
    expect(_common).toBeTruthy();
  });

  it("should call - date", () => {
    _common.date();
    expect(_common).toBeTruthy();
  });

  it("should call - windowHeight", () => {
    _common.windowHeight();
    expect(_common).toBeTruthy();
  });

  it("should call - windowWidth", () => {
    _common.windowWidth();
    expect(_common).toBeTruthy();
  });

  it("should call - scrollTop", () => {
    _common.scrollTop();
    expect(_common).toBeTruthy();
  });

  it("should call - ConvertUSformat", () => {
    const num = _common.ConvertUSformat("1234567890");
    expect(num).toBe("123-456-7890");
  });

  it("should call - ConvertUSformat", () => {
    const num = _common.ConvertUSformat("1234567890");
    expect(num).toBe("123-456-7890");
  });
  it('should call - validateDOB', () => {
    const num = _common.validateDOB('31');
  });
  it('should call - validateDOB else case', () => {
    const num = _common.validateDOB('10990');
  });
  it('should call - omitSpecialCharacter', () => {
    const even_data = {
      charCode: '64'
    };
    const num = _common.omitSpecialCharacter(even_data);
  });
  xit('should call - jsonToStrMap', () => {
    const testjson = {
      test: ''
    };
    const num = _common.jsonToStrMap(testjson);
  });
  it('should call - strMapToJson', () => {
    const num = _common.strMapToJson('');
  });
  it('should call - objToStrMap', () => {
    const num = _common.objToStrMap('');
  });
  it('should call - strMapToObj', () => {
    const num = _common.strMapToObj('');
  });
  xit('should call - jsonToMap', () => {
    const testjson = {
      test: 'test'
    };
    const num = _common.jsonToMap(testjson);
  });
  it('should call - mapToJson', () => {
    const num = _common.mapToJson('');
  });
  it('should call - loadDeviceInfo', () => {
    const num = _common.loadDeviceInfo();
  });
  it('should call - stringFormate', () => {
    const testarr = [];
    const num = _common.stringFormate('test', testarr);
  });
  it('should call - storeLoginPostUrl', () => {
    const num = _common.storeLoginPostUrl('');
  });
  it('should call - storeRegistrationPostUrl', () => {
    const num = _common.storeRegistrationPostUrl('');
  });
  it('should call - decodeHtml', () => {
    const num = _common.decodeHtml('');
  });
  it('should call - prepareStreet', () => {
    const num = _common.prepareStreet('');
  });
  it('should call - addNaturalBGColor', () => {
    const num = _common.addNaturalBGColor();
  });
  it('should call - removeNaturalBGColor', () => {
    const num = _common.removeNaturalBGColor();
  });
  it('should call - encryptCCNumber ', () => {
    const num = _common.encryptCCNumber('test');
  });
  xit('should call - initContext', () => {
    const num = _common.initContext();
  });
  it('should call - replaceUrl ', () => {
    const num = _common.replaceUrl('test');
  });
  xit('should call - navigate ', () => {
    const num = _common.navigate('test');
  });
  xit('should call - convertDataFormat ', () => {
    const num = _common.convertDataFormat('test', 'DD/MM/YYYY');
  });
});
