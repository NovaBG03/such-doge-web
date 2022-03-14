import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationComponent} from "../notification.component";
import {NotificationModel} from "../../model/notification.model";
import {NotificationService} from "../../notification.service";

@Component({
  selector: 'app-auto-closed-notification',
  templateUrl: './auto-closed-notification.component.html',
  styleUrls: ['./auto-closed-notification.component.css']
})
export class AutoClosedNotificationComponent implements NotificationComponent, OnInit {
  @Input() notification!: NotificationModel;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  secondsLeft = 10;

  constructor(public notificationService: NotificationService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft <= 0) {
        this.close()
      }
    }, 1000);
  }

  close(): void {
    this.closed.emit();
  }
}
