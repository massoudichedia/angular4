import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteTeamMemberModalComponent } from './invite-team-member-modal.component';

describe('InviteTeamMemberModalComponent', () => {
  let component: InviteTeamMemberModalComponent;
  let fixture: ComponentFixture<InviteTeamMemberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteTeamMemberModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteTeamMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
