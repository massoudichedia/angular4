import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhaseButtonComponent } from './add-phase-button.component';

describe('AddPhaseButtonComponent', () => {
  let component: AddPhaseButtonComponent;
  let fixture: ComponentFixture<AddPhaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPhaseButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
