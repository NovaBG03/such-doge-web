import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MemeListComponent} from "./meme-list/meme-list.component";
import {AboutComponent} from "./about/about.component";
import {ProfileComponent} from "./profile/profile.component";
import {MemeFormComponent} from "./meme-form/meme-form.component";
import {AuthComponent} from "./auth/auth.component";

const routes: Routes = [
  {path: '', component: MemeListComponent, pathMatch: 'full'},
  {path: 'top', component: MemeListComponent},
  {path: 'about', component: AboutComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'upload', component: MemeFormComponent},
  {path: 'register', component: AuthComponent},
  {path: 'login', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
