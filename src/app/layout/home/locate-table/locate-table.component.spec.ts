import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateTableComponent } from './locate-table.component';

describe('LocateTableComponent', () => {
  let component: LocateTableComponent;
  let fixture: ComponentFixture<LocateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
