import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "59xk3dYaLJauZVSQtDQmIC1tpD3ho1pHNXIFyLh0",
  authDomain: "modulo-6-4a11f.firebaseapp.com",
  databaseURL: "https://modulo-6-4a11f-default-rtdb.firebaseio.com/",
});

const rtdb = firebase.database();

export { rtdb };
