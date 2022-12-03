const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";

const state = {
  data: {
    userName: "",
    message: [],
  },
  listeners: [],
  init() {
    const chatroomsRef = rtdb.ref("/chatrooms/general");
    const currentState = this.getState();

    chatroomsRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      for (const m of messagesList) {
        currentState.message.push(m.message);
      }
      this.setState(currentState);
    });
  },
  getState() {
    return this.data;
  },
  setName(userName: string) {
    const currentState = this.getState();
    currentState.userName = userName;
  },
  pushMessage(message: string) {
    const stateName = this.data.userName;

    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userName: stateName,
        message: message,
      }),
    });
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
