import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {ThemeService} from "./util/theme.service";
import {NotificationService} from "./notification-panel/notification.service";
import {StompService} from "./notification-panel/stomp.service";
import {filter} from "rxjs/operators";
import {NotificationDto} from "./notification-panel/model/notification.dto.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private authService: AuthService,
              private themeService: ThemeService,
              private notificationService: NotificationService,
              private stompService: StompService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.notificationService.updateNotifications();

    this.authService.user
      .pipe(
        filter(user => !!user),
      ).subscribe(user => {
      console.log(user);
      // this.stompService.subscribe<NotificationDto>('/user/queue/notification',
      //   {'Authorization': user?.token},
      //   (notificationDto) => {
      //     console.log(notificationDto);
      //     if (notificationDto) {
      //       const notification = NotificationService.toNotification(notificationDto);
      //       this.notificationService.pushNotification(notification);
      //     }
      //   });
      this.stompService.subscribe<string>('/user/queue/notification',
        {'Authorization': user?.token},
        (message) => console.log(message));
    })
  }

  ngAfterViewInit(): void {
    this.themeService.startColorThemeManagement();
  }
}
