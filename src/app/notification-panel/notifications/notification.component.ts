import {EventEmitter} from "@angular/core";
import {NotificationModel} from "../notification.model";

export interface NotificationComponent {
  notification: NotificationModel;
  closed: EventEmitter<void>;
}
