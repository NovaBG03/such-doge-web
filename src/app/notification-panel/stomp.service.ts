import {Injectable, OnDestroy} from "@angular/core";
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {environment} from "../../environments/environment";

export type stompCallback<T> = (message: T | undefined) => void;

@Injectable({providedIn: 'root'})
export class StompService implements OnDestroy {
  private readonly destinationPrefix = '/doge-websocket';
  private stompClient: any = null;
  private subs: any[] = [];

  constructor() {
  }

  subscribe<T>(topic: string, headers: any, callback: stompCallback<T>): void {
    if (!this.stompClient?.connected) {
      // if stomp client is not connected, connect and subscribe to topic
      this.initClient();
      this.stompClient.connect(headers, () => {
        this.subscribeToTopic(topic, headers, callback);
      });
      return;
    }

    // todo add to collection of subs, resub all subs after reconnect
    this.subscribeToTopic(topic, headers, callback);
  }

  closeConnections(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
    this.stompClient.disconnect();
    this.stompClient = null;
  }

  // private autoReconnect(topic: string, headers: any, callback: stompCallback<any>): void {
  //   this.initClient();
  //   this.stompClient.connect(headers, () => {
  //     this.subscribeToTopic(topic, headers, callback);
  //   }, () => {
  //     this.stompClient.disconnect(() => {
  //       setTimeout(() => {
  //         console.log("STOMP CONNECTION FAILED");
  //         console.log("RETRYING IN 5 SECONDS");
  //         this.autoReconnect(topic, headers, callback);
  //       }, 5000);
  //     })
  //   });
  // }

  private initClient(): void {
    const url = `${environment.suchDogeApi}${this.destinationPrefix}`;
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    // this.stompClient.debug = null
    // this.stompClient.reconnect_delay = 5000;
  }

  private subscribeToTopic<T>(topic: string, headers: any, callback: (message: T | undefined) => void): void {
    const subscription = this.stompClient.subscribe(
      topic,
      (payload: any) => {
        if (payload.body) {
          callback(JSON.parse(payload.body));
          return;
        }
        callback(undefined);
      },
      headers);

    this.subs.push(subscription);
  }

  ngOnDestroy(): void {
    this.closeConnections();
  }
}
