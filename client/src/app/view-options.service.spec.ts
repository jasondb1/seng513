import { TestBed } from '@angular/core/testing';

import { ViewOptionsService } from './view-options.service';

describe('ViewOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewOptionsService = TestBed.get(ViewOptionsService);
    expect(service).toBeTruthy();
  });
});
