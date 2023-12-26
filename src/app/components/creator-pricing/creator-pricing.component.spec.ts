import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorPricingComponent } from './creator-pricing.component';

describe('CreatorPricingComponent', () => {
  let component: CreatorPricingComponent;
  let fixture: ComponentFixture<CreatorPricingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreatorPricingComponent]
    });
    fixture = TestBed.createComponent(CreatorPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
