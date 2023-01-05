const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";

type EmailFullnameType = {
  email: string;
  fullname: string;
};

const state = {
  data: {
    email: "",
    fullname: "",
    userId: "",
    roomId: "",
    existingRoom: "",
    rtdbRoomId: "",
    messages: [],
  },
  listeners: [],
  init() {
    /* const localStorageState = localStorage.getItem("state"); */
    const localData: any = localStorage.getItem("saved-state");
    if (!localData) {
      return;
    }
    this.setState(JSON.parse(localData));
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("saved-state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado: ", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  /* signIn(callback) {
    const currentState = this.getState();

    if (currentState.email) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          nombre: currentState.fullname,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.userId = data.id;
          this.setState(currentState);
        });
      callback();
    } else {
      console.error("error");
      callback();
    }
  }, */
  getRoom(roomId) {
    const currentState = this.getState();
    currentState.roomId = roomId;

    this.setState(currentState);

    fetch(API_BASE_URL + "/rooms/" + roomId, {
      method: "get",
    }).then((r) => {
      const contentLength = Number(r.headers.get("content-length"));
      if (contentLength != 0) {
        currentState.existingRoom = true;
      } else {
        currentState.existingRoom = false;
      }
      this.setState(currentState);
    });
  },
  listenRoom() {
    const currentState = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },
  setNewRoom(longRoomId, shortRoomId) {
    const currentState = this.getState();
    currentState.rtdbRoomId = longRoomId;
    currentState.roomId = shortRoomId;

    this.setState(currentState);

    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        longRoomId: longRoomId,
        shortRoomId: shortRoomId,
      }),
    });
  },
  setNewUser(longUserId, shortUserId, EmailFullname: EmailFullnameType) {
    const currentState = this.getState();
    currentState.userId = shortUserId;
    currentState.email = EmailFullname.email;
    currentState.fullname = EmailFullname.fullname;

    this.setState(currentState);

    fetch(API_BASE_URL + "/users", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        longUserId: longUserId,
        shortUserId: shortUserId,
        userEmail: EmailFullname.email,
        userFullname: EmailFullname.fullname,
      }),
    });
  },
  askNewRoom(callback?) {
    const currentState = this.getState();

    if (currentState.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.roomId = data.id;
          this.setState(currentState);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay user id");
      callback();
    }
  },
  accessToRoom(callback?) {
    const currentState = this.getState();
    const roomId = currentState.roomId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + currentState.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.rtdbRoomId = data.rtdbRoomId;
        this.setState(currentState);
        this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },
  pushMessage(message: string) {
    const currentState = this.getState();
    const roomId = currentState.roomId;
    const ownerName = currentState.fullname;

    currentState.messages.push(message);

    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        owner: ownerName,
        messages: message,
      }),
    });

    this.setState(currentState);
  },
};

export { state };
