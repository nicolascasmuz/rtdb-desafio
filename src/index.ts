import "./pages/signin";
import "./pages/chatroom";
import "./router";
import { state } from "./state";

(function () {
  state.init();
  /* // esto sucede en el submit del form de la primera pantalla
  state.setEmailFullname({
    email: "marce@apx.school",
    fullname: "Marce Zapaia",
  });
  state.signIn((err) => {
    if (err) console.error("hubo un error en el signIn");

    state.askNewRoom(() => {
      state.accessToRoom();
    });
  });

  // Propuesta:
  // al comenzar (para evitar la primera pantalla)
  // state.init()
  // recupera el state del localStorage
  // const cs = state.getState()
  // if(cs.rtdbRoomId && cs.userId){
  //   Router.push("/chat")
  // } */
})();
