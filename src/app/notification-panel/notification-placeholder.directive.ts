import {ComponentFactoryResolver, ComponentRef, Directive, Input, OnDestroy, ViewContainerRef} from '@angular/core';
import {NotificationModel} from "./notification.model";
import {NotificationComponent} from "./notifications/notification.component";
import {NotificationService} from "./notification.service";
import {Subscription} from "rxjs";

@Directive({
  selector: '[appNotificationPlaceholder]'
})
export class NotificationPlaceholderDirective implements OnDestroy {
  private closedSub!: Subscription;

  @Input() index!: number;

  @Input() set notification(notificationModel: NotificationModel) {
    const notificationFactory = this.componentFactoryResolver
      .resolveComponentFactory(notificationModel.component);

    this.viewContainerRef.clear();
    const componentRef: ComponentRef<NotificationComponent> =
      this.viewContainerRef.createComponent(notificationFactory);

    componentRef.instance.notification = notificationModel;

    this.closedSub?.unsubscribe();
    componentRef.instance.closed.subscribe(() => {
      this.notificationService.removeNotification(this.index);
      this.closedSub?.unsubscribe();
    })
  }

  constructor(public viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              private notificationService: NotificationService) {
  }

  ngOnDestroy(): void {
    this.closedSub?.unsubscribe();
  }
}
