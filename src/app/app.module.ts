import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MemeListComponent} from './meme/meme-list/meme-list.component';
import {AboutComponent} from './about/about.component';
import {ProfileManagementComponent} from './user/profile-managment/profile-management.component';
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
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "./rx-stomp-config";
import {BalanceComponent} from './wallet/balance/balance.component';
import {DepositComponent} from './wallet/balance/deposit/deposit.component';
import {DonationComponent} from './wallet/donation/donation.component';
import {
  AutoClosedNotificationComponent
} from './notification-panel/notifications/auto-closed-notification/auto-closed-notification.component';
import {environment} from "../environments/environment";
import {MemeDropDownComponent} from './meme/meme-cards/meme-card/meme-drop-down/meme-drop-down.component';
import {HomeComponent} from './home/home.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {ProfileImageComponent} from './user/profile-image/profile-image.component';
import {ProfileSettingsComponent} from './user/profile-managment/profile-settings/profile-settings.component';
import { ProfileAchievementsComponent } from './user/profile-managment/profile-achievements/profile-achievements.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MemeListComponent,
    AboutComponent,
    ProfileManagementComponent,
    MemeCardComponent,
    EmptyMemeCardComponent,
    MemeFormComponent,
    AuthComponent,
    HeaderDropDownComponent,
    ActivationComponent,
    SpinnerComponent,
    PopUpComponent,
    ImageResizerComponent,
    PaginationComponent,
    MemePendingComponent,
    NotificationPanelComponent,
    InfoNotificationComponent,
    EmailNotificationComponent,
    NotificationPlaceholderDirective,
    BalanceComponent,
    DepositComponent,
    DonationComponent,
    AutoClosedNotificationComponent,
    MemeDropDownComponent,
    HomeComponent,
    UserProfileComponent,
    ProfileImageComponent,
    ProfileSettingsComponent,
    ProfileAchievementsComponent,
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
    },
    {
      provide: InjectableRxStompConfig,
      useValue: RxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => validateDomain,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

function validateDomain() {
  if (environment.production && location.hostname !== environment.domain) {
    window.location.href = location.protocol + "//" + environment.domain + location.pathname;
  }
}
