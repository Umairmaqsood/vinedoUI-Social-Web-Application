import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVideoDialogComponent } from './upload-video-dialog.component';

describe('UploadVideoDialogComponent', () => {
  let component: UploadVideoDialogComponent;
  let fixture: ComponentFixture<UploadVideoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadVideoDialogComponent]
    });
    fixture = TestBed.createComponent(UploadVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
