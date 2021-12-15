import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MemeListComponent} from './meme/meme-list/meme-list.component';
import {AboutComponent} from './about/about.component';
import {ProfileComponent} from './profile/profile.component';
import {MemeCardComponent} from './meme/meme-cards/meme-card/meme-card.component';
import {EmptyMemeCardComponent} from './meme/meme-cards/empty-meme-card/empty-meme-card.component';
import {MemeFormComponent} from './meme/meme-form/meme-form.component';
import {AuthComponent} from './auth/auth.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HeaderDropDownComponent} from './header/header-drop-down/header-drop-down.component';
import {ActivationComponent} from './auth/activation/activation.component';
import {SpinnerComponent} from './util/spinner/spinner.component';
import {PopUpComponent} from './util/pop-up/pop-up.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {ImageCropperModule} from "ngx-image-cropper";
import {ImageResizerComponent} from './util/image-resizer/image-resizer.component';
import {MemeMyComponent} from './meme/meme-my/meme-my.component';
import {PaginationComponent} from './util/pagination/pagination.component';
import {MemePendingComponent} from './meme/admin/meme-pending/meme-pending.component';
import {NotificationPanelComponent} from "./notification-panel/notification-panel.component";
import {
  InfoNotificationComponent
} from './notification-panel/notifications/info-notification/info-notification.component';
import {
  EmailNotificationComponent
} from './notification-panel/notifications/email-notification/email-notification.component';
import {NotificationPlaceholderDirective} from './notification-panel/notification-placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MemeListComponent,
    AboutComponent,
    ProfileComponent,
    MemeCardComponent,
    EmptyMemeCardComponent,
    MemeFormComponent,
    AuthComponent,
    HeaderDropDownComponent,
    ActivationComponent,
    SpinnerComponent,
    PopUpComponent,
    ImageResizerComponent,
    MemeMyComponent,
    PaginationComponent,
    MemePendingComponent,
    NotificationPanelComponent,
    InfoNotificationComponent,
    EmailNotificationComponent,
    NotificationPlaceholderDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AppRoutingModule,
    FormsModule
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
