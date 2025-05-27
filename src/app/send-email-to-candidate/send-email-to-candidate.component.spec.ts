import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailToCandidateComponent } from './send-email-to-candidate.component';

describe('SendEmailToCandidateComponent', () => {
  let component: SendEmailToCandidateComponent;
  let fixture: ComponentFixture<SendEmailToCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendEmailToCandidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEmailToCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
