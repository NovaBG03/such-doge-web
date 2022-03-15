import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NotificationComponent} from "../notification.component";
import {NotificationModel} from "../../model/notification.model";
import {NotificationService} from "../../notification.service";

@Component({
  selector: 'app-auto-closed-notification',
  templateUrl: './auto-closed-notification.component.html',
  styleUrls: ['./auto-closed-notification.component.css']
})
export class AutoClosedNotificationComponent implements NotificationComponent, OnInit, OnDestroy {
  @Input() notification!: NotificationModel;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  secondsLeft = 20;
  private interval: any;

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.secondsLeft--;
      console.log(this.secondsLeft);
      if (this.secondsLeft <= 0) {
        this.close();
      }
    }, 1000);
  }

  close(): void {
    clearInterval(this.interval);
    this.closed.emit();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
