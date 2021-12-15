import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationComponent} from "../notification.component";
import {NotificationModel} from "../../notification.model";
import {NotificationService} from "../../notification.service";

@Component({
  selector: 'app-email-info-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.css']
})
export class EmailNotificationComponent implements NotificationComponent, OnInit {
  @Input() notification!: NotificationModel;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.closed.emit();
  }
}
