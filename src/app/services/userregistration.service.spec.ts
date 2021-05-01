import { TestBed } from '@angular/core/testing';

import { UserregistrationService } from './userregistration.service';

describe('UserregistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserregistrationService = TestBed.get(UserregistrationService);
    expect(service).toBeTruthy();
  });
});
