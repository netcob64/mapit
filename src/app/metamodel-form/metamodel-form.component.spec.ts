import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetamodelFormComponent } from './metamodel-form.component';

describe('MetamodelFormComponent', () => {
  let component: MetamodelFormComponent;
  let fixture: ComponentFixture<MetamodelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetamodelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetamodelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
