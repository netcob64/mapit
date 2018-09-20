import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFormDialogComponent } from './map-form-dialog.component';

describe('MapFormComponent', () => {
  let component: MapFormDialogComponent;
  let fixture: ComponentFixture<MapFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
