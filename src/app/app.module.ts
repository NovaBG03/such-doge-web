import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MemeListComponent} from './meme/meme-list/meme-list.component';
import {AboutComponent} from './about/about.component';
import {SettingsComponent} from './user/settings/settings.component';
import {MemeCardComponent} from './meme/meme-cards/meme-card/meme-card.component';
import {EmptyMemeCardComponent} from './meme/meme-cards/empty-meme-card/empty-meme-card.component';
import {MemeFormComponent} from './meme/meme-form/meme-form.component';
import {AuthComponent} from './auth/auth.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HeaderDropDownComponent} from './header/header-drop-down/header-drop-down.component';
import {ActivationComponent} from './auth/activation/activation.component';
import {SpinnerComponent} from './util/spinner/spinner.component';
import {AlertPopUpComponent} from './util/alert/alert-pop-up/alert-pop-up.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {ImageCropperModule} from "ngx-image-cropper";
import {ImageResizerComponent} from './util/image-resizer/image-resizer.component';
import {PaginationComponent} from './util/pagination/pagination.component';
import {MemePendingComponent} from './meme/admin/meme-pending/meme-pending.component';
import {NotificationPanelComponent} from "./util/notification/notification-panel/notification-panel.component";
import {
  InfoNotificationComponent
} from './util/notification/notification-components/info-notification/info-notification.component';
import {
  EmailNotificationComponent
} from './util/notification/notification-components/email-notification/email-notification.component';
import {NotificationPlaceholderDirective} from './util/notification/notification-placeholder.directive';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "./rx-stomp-config";
import {BalanceComponent} from './wallet/balance/balance.component';
import {DepositComponent} from './wallet/balance/deposit/deposit.component';
import {DonationComponent} from './wallet/donation/donation.component';
import {
  AutoClosedNotificationComponent
} from './util/notification/notification-components/auto-closed-notification/auto-closed-notification.component';
import {environment} from "../environments/environment";
import {MemeDropDownComponent} from './meme/meme-cards/meme-card/meme-drop-down/meme-drop-down.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileImageCardComponent} from './user/profile-image-card/profile-image-card.component';
import {SettingsFormComponent} from './user/settings/settings-form/settings-form.component';
import { ProfileAchievementsComponent } from './user/profile/achievements/profile-achievements.component';
import { AlertPanelComponent } from './util/alert/alert-panel/alert-panel.component';
import { MemeOrderFilterComponent } from './meme/meme-list/meme-order-filter/meme-order-filter.component';
import { TopComponent } from './top/top.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxMasonryModule} from "ngx-masonry";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MemeListComponent,
    AboutComponent,
    SettingsComponent,
    MemeCardComponent,
    EmptyMemeCardComponent,
    MemeFormComponent,
    AuthComponent,
    HeaderDropDownComponent,
    ActivationComponent,
    SpinnerComponent,
    AlertPopUpComponent,
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
    ProfileComponent,
    ProfileImageCardComponent,
    SettingsFormComponent,
    ProfileAchievementsComponent,
    AlertPanelComponent,
    MemeOrderFilterComponent,
    TopComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxMasonryModule,
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
