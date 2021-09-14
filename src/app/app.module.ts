import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MemeListComponent } from './meme-list/meme-list.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { MemeComponent } from './meme-list/meme/meme.component';
import { EmptyMemeComponent } from './meme-list/empty-meme/empty-meme.component';
import { MenuComponent } from './menu/menu.component';
import { MemeFormComponent } from './meme-form/meme-form.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MemeListComponent,
    AboutComponent,
    ProfileComponent,
    MemeComponent,
    EmptyMemeComponent,
    MenuComponent,
    MemeFormComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
