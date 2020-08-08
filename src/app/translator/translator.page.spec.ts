import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TranslatorPage } from './translator.page';

describe('TranslatorPage', () => {
  let component: TranslatorPage;
  let fixture: ComponentFixture<TranslatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TranslatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
