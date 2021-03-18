import { FamilyMembersResolver } from './family-resolver.service';
import { TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientService } from './http.service';
import { promise } from 'protractor';

describe('Family-resolver', () => {
  let familyMembersResolver: FamilyMembersResolver;
  let http: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        familyMembersResolver = TestBed.get(FamilyMembersResolver);
        http = TestBed.get(HttpClientService);
      });
  }));
  it('Check Service instance is available', () => {
    expect(familyMembersResolver).toBeTruthy();
  });

  it('should call - resolve', () => {
    familyMembersResolver.resolve(null);
    spyOn(http, 'doPost').and.returnValue(
      Promise.resolve({ json: () => ({ members: '' }) })
    );
    expect(familyMembersResolver).toBeTruthy();
  });

  it('should call - resolve - fail scenario', () => {
    familyMembersResolver.resolve(null);
    spyOn(http, 'doPost').and.returnValue(
      Promise.reject({ json: () => ({ members: '' }) })
    );
    expect(familyMembersResolver).toBeTruthy();
  });
});
