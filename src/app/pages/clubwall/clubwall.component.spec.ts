import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubwallComponent } from './clubwall.component';

describe('ClubwallComponent', () => {
  let component: ClubwallComponent;
  let fixture: ComponentFixture<ClubwallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubwallComponent]
    });
    fixture = TestBed.createComponent(ClubwallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
