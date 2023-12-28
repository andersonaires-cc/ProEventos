import { TestBed } from '@angular/core/testing';

import { RedeSocialServiceService } from './redeSocial.service';

describe('RedeSocialServiceService', () => {
  let service: RedeSocialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedeSocialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
