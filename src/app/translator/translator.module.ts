import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslatorPageRoutingModule } from './translator-routing.module';

import { TranslatorPage } from './translator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslatorPageRoutingModule
  ],
  declarations: [TranslatorPage]
})
export class TranslatorPageModule {}
