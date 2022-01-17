import {EmailNotificationComponent} from "../notifications/email-notification/email-notification.component";
import {InfoNotificationComponent} from "../notifications/info-notification/info-notification.component";

export interface NotificationModel {
  id?: number;
  component: NotificationComponentType;
  category: NotificationCategory;
  title: string;
  message: string;
}

export type NotificationComponentType = typeof EmailNotificationComponent | typeof InfoNotificationComponent;

export enum NotificationCategory {
  Success = "success",
  Danger = "danger",
  Info = "info"
}
