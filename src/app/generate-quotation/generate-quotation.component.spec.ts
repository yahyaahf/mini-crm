import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQuotationComponent } from './generate-quotation.component';

describe('GenerateQuotationComponent', () => {
  let component: GenerateQuotationComponent;
  let fixture: ComponentFixture<GenerateQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateQuotationComponent]
    });
    fixture = TestBed.createComponent(GenerateQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
