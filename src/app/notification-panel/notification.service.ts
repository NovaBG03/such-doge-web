import {NotificationCategory, NotificationModel} from "./model/notification.model";
import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
import {EmailNotificationComponent} from "./notifications/email-notification/email-notification.component";
import {InfoNotificationComponent} from "./notifications/info-notification/info-notification.component";
import {NotificationDto} from "./model/notification.dto.model";
import {Message} from "@stomp/stompjs";
import {RxStompService} from "@stomp/ng2-stompjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class NotificationService implements OnDestroy {
  private notifications: NotificationModel[] = []
  private notificationSubject = new Subject<void>();

  private stompListenerSub!: Subscription;

  get notificationsCount(): number {
    return this.notifications.length;
  };

  constructor(private stompService: RxStompService, private http: HttpClient) {
  }

  notificationsChanged(): Observable<void> {
    return this.notificationSubject.asObservable();
  }

  getNotifications(count?: number): NotificationModel[] {
    if (!count) {
      count = this.notifications.length;
    }

    if (count <= 0) {
      count = 1;
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

  pushNotification(...notifications: NotificationModel[]): void {
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

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationSubject.next();
  }

  closeAllNotifications(): void {
    this.notifications = this.notifications.filter(notification =>
      notification.component === EmailNotificationComponent);
    this.notificationSubject.next();
  }

  getCategoryIcon(category: NotificationCategory): string {
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

  removeNotification(notification: NotificationModel): void {
    const index = this.notifications.findIndex(n => NotificationService.shallowEqual(n, notification));
    this.removeNotificationAt(index);
  }

  removeEmailConfirmation(): void {
    const emailNotificationIndex = this.notifications.findIndex(n => n.component === EmailNotificationComponent);
    this.removeNotificationAt(emailNotificationIndex);
  }

  removeNotificationAt(index: number): void {
    if (index < 0 || index > this.notifications.length) {
      return;
    }
    this.notifications.splice(index, 1);
    this.notificationSubject.next();
  }

  stopListening(): void {
    this.stompListenerSub?.unsubscribe();
  }

  listenForNotifications(): void {
    this.fetchNotifications();
    this.stompListenerSub = this.stompService
      .watch('/user/queue/notification')
      .subscribe((msg: Message) => {
        const notificationDto = JSON.parse(msg.body) as NotificationDto;
        if (notificationDto) {
          const notification = NotificationService.toNotification(notificationDto);
          this.pushNotification(notification);
        }
      });
  }

  private fetchNotifications(): void {
    // get notifications from the server and push them to the list
    // this.pushNotification();
  }

  ngOnDestroy() {
    this.stompListenerSub.unsubscribe();
  }

  public static toNotification(dto: NotificationDto): NotificationModel {
    const categoryKey =
      (dto.category.charAt(0).toUpperCase() + dto.category.slice(1)) as keyof typeof NotificationCategory;

    return {
      id: dto.id,
      component: InfoNotificationComponent,
      category: NotificationCategory[categoryKey],
      title: dto.title,
      message: dto.message
    };
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
}
