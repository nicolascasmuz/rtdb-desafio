import { state } from "../state";

customElements.define(
  "chatroom-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    buttonText: string;
    userName: string = "";
    messages: string[] = [];
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.addListeners();
      this.render();
    }
    addListeners() {
      state.subscribe(() => {
        const currentState = state.getState();
        this.messages = currentState.message;
        this.userName = currentState.userName;
        this.render();
      });
    }
    connectedCallback() {
      const formEl = this.shadow.querySelector(
        ".chatroom-form__form"
      ) as HTMLElement;
      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const message = e.target["new-message"].value;
        state.pushMessage(message);
      });
    }
    render() {
      this.buttonText = this.getAttribute("button-text") || "Enviar";

      const div = document.createElement("div");
      div.innerHTML = `
        <header class="red-header"></header>
        <div class="chatroom-div">
          <section class="chat-box__section">
              ${this.messages
                .map((m) => {
                  return `
                  <div class="user1__message-box">
                    <p class="user1__message-text"><span class="user1__message-span">${this.userName}</span>${m}</p>
                  </div>`;
                })
                .join("")}
          </section>
          <form class="chatroom-form__form">
            <input class="chatroom-form__input" type="text" name="new-message">
            <button class="chatroom-form__button">${this.buttonText}</button>
          </form>
        </div>
        `;

      const style = document.createElement("style");
      style.innerHTML = `
            .red-header {
              background-color: #FF8282;
              height: 60px;
              margin-bottom: 50px;
            }
            .chatroom-div {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            .chat-box__section {
              display: flex;
              flex-direction: column;
              gap: 6px;
              font-family: 'Roboto';
              width: 312px;
              min-height: 312px;
              max-height: 312px;
              border: solid 2px #000000;
              border-radius: 4px;
              overflow: auto;
              padding: 10px 6px 10px 6px;
            }
            .user1__message-box {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              align-self: flex-end;
              width: fit-content;
              max-width: 250px;
              height: fit-content;
              background-color: #78e08f;
              border-radius: 4px;
              padding: 6px 6px 6px 6px;
            }
            .user1__message-text {
              align-text: right;
              margin: 0;
            }
            .user1__message-span {
              display: block;
              font-size: 12px;
              font-weight: 600;
              text-align: right;
            }
            .user2__message-box {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              align-self: flex-start;
              width: fit-content;
              max-width: 250px;
              height: fit-content;
              background-color: #CAD3C8;
              border-radius: 4px;
              padding: 6px 6px 6px 6px;
            }
            .user2__message-text {
              align-text: left;
              margin: 0;
            }
            .chatroom-form__form {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            .chatroom-form__input {
              min-width: 312px;
              min-height: 55px;
              border: solid 2px #000000
              border-radius: 4px;
              font-family: 'Roboto';
              font-size: 25px;
            }
            .chatroom-form__button {
              background-color: #9CBBE9;
              border: none;
              border-radius: 4px;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 22px;
              min-width: 312px;
              min-height: 55px;
            }
              `;

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);