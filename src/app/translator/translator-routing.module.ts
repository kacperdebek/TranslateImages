import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranslatorPage } from './translator.page';

const routes: Routes = [
  {
    path: '',
    component: TranslatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranslatorPageRoutingModule {}
