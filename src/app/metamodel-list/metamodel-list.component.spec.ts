import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetamodelListComponent } from './metamodel-list.component';

describe('MetamodelListComponent', () => {
  let component: MetamodelListComponent;
  let fixture: ComponentFixture<MetamodelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetamodelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetamodelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
