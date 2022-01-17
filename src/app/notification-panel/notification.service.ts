import {NotificationCategory, NotificationModel} from "./model/notification.model";
import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {EmailNotificationComponent} from "./notifications/email-notification/email-notification.component";
import {InfoNotificationComponent} from "./notifications/info-notification/info-notification.component";
import {NotificationDto} from "./model/notification.dto.model";

@Injectable({providedIn: 'root'})
export class NotificationService {
  private notifications: NotificationModel[] = []

  private notificationSubject = new Subject<void>();

  get notificationsCount(): number {
    return this.notifications.length;
  };

  constructor() {
  }

  public notificationsChanged(): Observable<void> {
    return this.notificationSubject.asObservable();
  }

  public getNotifications(count?: number): NotificationModel[] {
    if (!count) {
      count = this.notifications.length;
    }

    let startingIndex = this.notifications.length - count;
    if (startingIndex < 0) {
      startingIndex = 0;
    }

    const notificationsClone: NotificationModel[] = [];
    this.notifications.slice(startingIndex)
      .forEach(notification =>
        notificationsClone.push(Object.assign({}, notification))
      );
    return notificationsClone;
  }

  public pushNotification(...notifications: NotificationModel[]): void {
    let isChanged = false;
    notifications.forEach(notification => {
      if (notification.component === EmailNotificationComponent
        && this.notifications.find(n => n.component === EmailNotificationComponent)) {
        return;
      }
      this.notifications.push(notification);
      isChanged = true;
    })

    if (isChanged) {
      this.notificationSubject.next();
    }
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.notificationSubject.next();
  }

  public closeAllNotifications(): void {
    this.notifications = this.notifications.filter(notification =>
      notification.component === EmailNotificationComponent);
    this.notificationSubject.next();
  }

  public getCategoryIcon(category: NotificationCategory): string {
    switch (category) {
      case NotificationCategory.Danger:
        return '📌';
      case NotificationCategory.Success:
        return '📗';
      case NotificationCategory.Info:
        return '😊';
      default:
        return '👽';
    }
  }

  public removeNotification(notification: NotificationModel): void {
    const index = this.notifications.findIndex(n => NotificationService.shallowEqual(n, notification));
    this.removeNotificationAt(index);
  }

  public removeEmailConfirmation(): void {
    const emailNotificationIndex = this.notifications.findIndex(n => n.component === EmailNotificationComponent);
    this.removeNotificationAt(emailNotificationIndex);
  }

  private removeNotificationAt(index: number): void {
    if (index < 0 || index > this.notifications.length) {
      return;
    }
    this.notifications.splice(index, 1);
    this.notificationSubject.next();
  }

  private static shallowEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  updateNotifications(): void {
    // get notifications from the server and add them to the list
  }

  public static toNotification(notificationDto: NotificationDto): NotificationModel {
    return {
      component: InfoNotificationComponent,
      category: NotificationCategory[notificationDto.category as keyof typeof NotificationCategory],
      title: notificationDto.title,
      message: notificationDto.message
    };
  }
}
