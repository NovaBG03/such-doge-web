import {NotificationCategory, NotificationModel} from "./notification.model";
import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {InfoNotificationComponent} from "./notifications/info-notification/info-notification.component";
import {EmailNotificationComponent} from "./notifications/email-notification/email-notification.component";

@Injectable({providedIn: 'root'})
export class NotificationService {
  private notifications: NotificationModel[] = []
  // [
  //   {
  //     component: EmailNotificationComponent,
  //     category: NotificationCategory.Danger,
  //     title: 'Email is not confirmed',
  //     message: 'Please confirm your email to access all of the sites functionality!'
  //   },
  //   {
  //     component: InfoNotificationComponent,
  //     category: NotificationCategory.Info,
  //     title: 'Welcome to my site',
  //     message: 'Enjoy :)'
  //   },
  //   {
  //     component: InfoNotificationComponent,
  //     category: NotificationCategory.Success,
  //     title: 'Meme uploaded successfully',
  //     message: 'You can check your meme status at my memes!'
  //   },
  //   {
  //     component: InfoNotificationComponent,
  //     category: NotificationCategory.Danger,
  //     title: 'Error',
  //     message: ''
  //   }
  // ];

  private notificationSubject = new Subject<NotificationModel[]>();

  constructor() {
  }

  public notificationsChanged(): Observable<NotificationModel[]> {
    return this.notificationSubject.asObservable();
  }

  public getNotifications(): NotificationModel[] {
    const notificationsClone: NotificationModel[] = [];
    this.notifications.forEach(notification =>
      notificationsClone.push(Object.assign({}, notification))
    );
    return notificationsClone;
  }

  public notify(notification: NotificationModel): void {
    if (notification.component === EmailNotificationComponent
      && this.notifications.find(n => n.component === EmailNotificationComponent)) {
      return;
    }

    this.notifications.push(notification);
    this.notificationSubject.next(this.getNotifications());
  }

  public removeNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationSubject.next(this.getNotifications());
  }

  public removeEmailConfirmation(): void {
    const emailNotificationIndex = this.notifications.findIndex(n => n.component === EmailNotificationComponent);
    if (emailNotificationIndex >= 0) {
      this.removeNotification(emailNotificationIndex);
    }
  }

  public clearNotifications(): void {
    this.notifications = [];
    this.notificationSubject.next(this.getNotifications())
  }

  public getCategoryIcon(category: NotificationCategory): string {
    switch (category) {
      case NotificationCategory.Danger:
        return '🚨️';
      case NotificationCategory.Success:
        return '📗';
      case NotificationCategory.Info:
        return '😊';
      default:
        return '👽';
    }
  }

  public getCategoryClass(category: NotificationCategory): { [s: string]: boolean } {
    return {[category]: true};
  }
}
