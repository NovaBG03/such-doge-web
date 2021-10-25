import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MemeListComponent} from "./meme/meme-list/meme-list.component";
import {AboutComponent} from "./about/about.component";
import {ProfileComponent} from "./profile/profile.component";
import {MemeFormComponent} from "./meme/meme-form/meme-form.component";
import {AuthComponent} from "./auth/auth.component";
import {ActivationComponent} from "./auth/activation/activation.component";
import {MemeMyComponent} from "./meme/meme-my/meme-my.component";

const routes: Routes = [
  {path: '', redirectTo: 'all', pathMatch: 'full'},
  {path: 'all', component: MemeListComponent},
  {path: 'top', component: MemeListComponent},
  {path: 'my', component: MemeMyComponent},
  {path: 'about', component: AboutComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'upload', component: MemeFormComponent},
  {path: 'register', component: AuthComponent},
  {path: 'login', component: AuthComponent},
  {path: 'activate/:token', component: ActivationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
