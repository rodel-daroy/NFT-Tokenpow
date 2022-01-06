import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsTableComponent } from './donations-table.component';
import {SelltokensModule} from '../../selltokens.module';
import {AppModule} from '../../../app.module';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {ButtonModule} from 'primeng/button';

describe('DonationsTableComponent', () => {
  let component: DonationsTableComponent;
  let fixture: ComponentFixture<DonationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationsTableComponent ],
      imports: [AppModule, SelltokensModule, ButtonModule],
      providers: [DynamicDialogConfig]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
