import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MemeListComponent} from './meme-list/meme-list.component';
import {AboutComponent} from './about/about.component';
import {ProfileComponent} from './profile/profile.component';
import {MemeComponent} from './meme-list/meme/meme.component';
import {EmptyMemeComponent} from './meme-list/empty-meme/empty-meme.component';
import {MemeFormComponent} from './meme-form/meme-form.component';
import {AuthComponent} from './auth/auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { HeaderDropDownComponent } from './header/header-drop-down/header-drop-down.component';
import { ActivationComponent } from './auth/activation/activation.component';
import { SpinnerComponent } from './util/spinner/spinner.component';
import { PopUpComponent } from './util/pop-up/pop-up.component';

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
    MemeFormComponent,
    AuthComponent,
    HeaderDropDownComponent,
    ActivationComponent,
    SpinnerComponent,
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
