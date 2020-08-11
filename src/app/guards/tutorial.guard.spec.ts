import { TestBed } from '@angular/core/testing';

import { TutorialGuard } from './tutorial.guard';

describe('TutorialGuard', () => {
  let guard: TutorialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TutorialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
