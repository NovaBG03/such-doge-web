import {InjectableRxStompConfig, RxStompService} from '@stomp/ng2-stompjs';
import {environment} from "../environments/environment";

export const RxStompConfig: InjectableRxStompConfig = {
  brokerURL: `ws://${environment.domain}/doge-websocket`,
  connectHeaders: {},
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 5000,

  beforeConnect: (stompClient: RxStompService): void => {
    const authToken = localStorage.getItem(environment.authTokenKey);
    if (!authToken) {
      stompClient.deactivate();
      return;
    }
    stompClient.stompClient.connectHeaders = {
      [environment.authHeader]: environment.authPrefix + authToken
    };
  },

  // Skip this key to stop logging to console
  // debug: (msg: string): void => {
  //   console.log(msg);
  // },
};
