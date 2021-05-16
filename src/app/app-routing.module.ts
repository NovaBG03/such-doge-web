import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MemeListComponent} from "./meme-list/meme-list.component";

const routes: Routes = [
  {path: '', component: MemeListComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
