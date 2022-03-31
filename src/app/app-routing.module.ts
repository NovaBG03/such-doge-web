import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemeListComponent} from "./meme/meme-list/meme-list.component";
import {AboutComponent} from "./about/about.component";
import {ProfileComponent} from "./profile/profile.component";
import {MemeFormComponent} from "./meme/meme-form/meme-form.component";
import {AuthComponent} from "./auth/auth.component";
import {ActivationComponent} from "./auth/activation/activation.component";
import {MemeMyComponent} from "./meme/meme-my/meme-my.component";
import {AuthGuard} from "./auth/guards/auth.guard";
import {MemePendingComponent} from "./meme/admin/meme-pending/meme-pending.component";
import * as authGuardStrategy from "./auth/guards/auth.guard.strategy";
import {HomeComponent} from "./home/home.component";



const routes: Routes = [
  {path: '', redirectTo: 'all', pathMatch: 'full'},
  {path: 'all', component: HomeComponent},
  {path: 'top', component: MemeListComponent},
  {path: 'about', component: AboutComponent},
  {
    path: 'my', component: MemeMyComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.authenticated()}
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.authenticated()}
  },
  {
    path: 'upload', component: MemeFormComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.authenticated()}
  },
  {
    path: 'admin', component: MemePendingComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.authenticatedIsModeratorOrAdmin()}
  },
  {
    path: 'register', component: AuthComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.notAuthenticated()}
  },
  {
    path: 'login', component: AuthComponent, canActivate: [AuthGuard],
    data: {authGuardStrategy: authGuardStrategy.notAuthenticated()}
  },
  {path: 'activate/:token', component: ActivationComponent},
  {path: '**', redirectTo: 'all'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
