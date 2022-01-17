import {Injectable, OnDestroy} from "@angular/core";
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class StompService implements OnDestroy {
  private readonly destinationPrefix = '/doge-websocket';
  private stompClient: any = null;
  private subs: any[] = [];

  constructor() {
  }

  subscribe<T>(topic: string, headers: any, callback: (message: T | undefined) => void): void {
    if (!this.stompClient) {
      this.initClient();
    }

    const connected = this.stompClient.connected;
    if (!connected) {
      // if stomp client is not connected, connect and subscribe to topic
      this.stompClient.connect(headers, () => {
        this.subscribeToTopic(topic, headers, callback);
      });
      return;
    }

    this.subscribeToTopic(topic, headers, callback);
  }

  closeConnections(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
    this.stompClient.disconnect();
    this.stompClient = null;
  }

  private initClient() {
    const url = `${environment.suchDogeApi}${this.destinationPrefix}`;
    const socket = new SockJs(url);
    this.stompClient = Stomp.over(socket);
    this.stompClient.reconnect_delay = 5000;
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
