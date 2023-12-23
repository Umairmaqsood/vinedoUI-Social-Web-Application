import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncSpinnerButtonComponent } from './async-spinner-button.component';

describe('AsyncSpinnerButtonComponent', () => {
  let component: AsyncSpinnerButtonComponent;
  let fixture: ComponentFixture<AsyncSpinnerButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AsyncSpinnerButtonComponent]
    });
    fixture = TestBed.createComponent(AsyncSpinnerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
