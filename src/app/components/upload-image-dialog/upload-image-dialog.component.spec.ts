import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageDialogComponent } from './upload-image-dialog.component';

describe('UploadImageDialogComponent', () => {
  let component: UploadImageDialogComponent;
  let fixture: ComponentFixture<UploadImageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadImageDialogComponent]
    });
    fixture = TestBed.createComponent(UploadImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
