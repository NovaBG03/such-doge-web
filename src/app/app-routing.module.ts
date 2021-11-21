import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MemeListComponent} from "./meme/meme-list/meme-list.component";
import {AboutComponent} from "./about/about.component";
import {ProfileComponent} from "./profile/profile.component";
import {MemeFormComponent} from "./meme/meme-form/meme-form.component";
import {AuthComponent} from "./auth/auth.component";
import {ActivationComponent} from "./auth/activation/activation.component";
import {MemeMyComponent} from "./meme/meme-my/meme-my.component";
import {AuthGuard} from "./auth/auth.guard";
import {NotAuthenticatedGuard} from "./auth/not-authenticated.guard";

const routes: Routes = [
  {path: '', redirectTo: 'all', pathMatch: 'full'},
  {path: 'all', component: MemeListComponent},
  {path: 'top', component: MemeListComponent},
  {path: 'about', component: AboutComponent},
  {path: 'my', component: MemeMyComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'upload', component: MemeFormComponent, canActivate: [AuthGuard]},
  {path: 'register', component: AuthComponent, canActivate: [NotAuthenticatedGuard]},
  {path: 'login', component: AuthComponent, canActivate: [NotAuthenticatedGuard]},
  {path: 'activate/:token', component: ActivationComponent},
  {path: '**', redirectTo: 'all'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
