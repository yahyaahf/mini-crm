import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuotationComponent } from './update-quotation.component';

describe('UpdateQuotationComponent', () => {
  let component: UpdateQuotationComponent;
  let fixture: ComponentFixture<UpdateQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateQuotationComponent]
    });
    fixture = TestBed.createComponent(UpdateQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
