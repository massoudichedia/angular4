import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEvaluationComponent } from './candidate-evaluation.component';

describe('CandidateEvaluationComponent', () => {
  let component: CandidateEvaluationComponent;
  let fixture: ComponentFixture<CandidateEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
