import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NotificationModel} from "./notification.model";
import {NotificationService} from "./notification.service";
import {Subscription} from "rxjs";
import {NotificationPlaceholderDirective} from "./notification-placeholder.directive";

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.css']
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  notifications: NotificationModel[] = [];
  @ViewChildren(NotificationPlaceholderDirective) notificationHosts!: QueryList<NotificationPlaceholderDirective>;

  private notificationSub!: Subscription;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
    this.notificationSub = this.notificationService.notificationsChanged()
      .subscribe(notifications => this.notifications = notifications);
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
  }
}
