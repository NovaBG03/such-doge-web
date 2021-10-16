import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MemeListComponent} from './meme/meme-list/meme-list.component';
import {AboutComponent} from './about/about.component';
import {ProfileComponent} from './profile/profile.component';
import {MemeCardComponent} from './meme/meme-list/meme-card/meme-card.component';
import {EmptyMemeComponent} from './meme/meme-list/empty-meme/empty-meme.component';
import {MemeFormComponent} from './meme/meme-form/meme-form.component';
import {AuthComponent} from './auth/auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HeaderDropDownComponent} from './header/header-drop-down/header-drop-down.component';
import {ActivationComponent} from './auth/activation/activation.component';
import {SpinnerComponent} from './util/spinner/spinner.component';
import {PopUpComponent} from './util/pop-up/pop-up.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {ImageCropperModule} from "ngx-image-cropper";
import { ImageResizerComponent } from './util/image-resizer/image-resizer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MemeListComponent,
    AboutComponent,
    ProfileComponent,
    MemeCardComponent,
    EmptyMemeComponent,
    MemeFormComponent,
    AuthComponent,
    HeaderDropDownComponent,
    ActivationComponent,
    SpinnerComponent,
    PopUpComponent,
    ImageResizerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
