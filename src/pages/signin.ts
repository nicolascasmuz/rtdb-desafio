import { Router } from "@vaadin/router";
import { state } from "../state";

customElements.define(
  "signin-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    labelText: string;
    buttonText: string;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    connectedCallback() {
      const formEl = this.shadow.querySelector(
        ".signin-form__form"
      ) as HTMLElement;
      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const userName = e.target.name.value;
        state.setName(userName);
        Router.go("/chatroom");
      });
    }
    render() {
      this.labelText = this.getAttribute("label-text") || "Tu nombre";
      this.buttonText = this.getAttribute("button-text") || "Comenzar";

      const section = document.createElement("section");
      section.innerHTML = `
            <header class="red-header"></header>
            <form class="signin-form__form">
              <div class="label-input-container">
                <label class="signin-form__label">${this.labelText}</label>
                <input class="signin-form__input" type="text" name="name">
              </div>
            <button class="signin-form__button">${this.buttonText}</button>
            </form>
          `;

      const style = document.createElement("style");
      style.innerHTML = `
            .red-header {
            background-color: #FF8282;
            height: 60px;
            margin-bottom: 50px;
            }
            .signin-form__form {
            display: flex;
            flex-direction: column;
            align-items: center;
            }
            .label-input-container {
            display: flex;
            flex-direction: column;
            }
            .signin-form__label {
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 24px;
            font-weight: 500;
            color: #000000;
            margin: 0;
            }
            .signin-form__input {
            min-width: 312px;
            min-height: 55px;
            border: solid 2px #000000
            border-radius: 4px;
            font-family: 'Roboto';
            font-size: 25px;
            }
            .signin-form__button {
            background-color: #9CBBE9;
            border: none;
            border-radius: 4px;
            color: #000000;
            font-family: 'Roboto', cursive;
            font-size: 22px;
            min-width: 312px;
            min-height: 55px;
            margin-top: 16px;
            }
            `;

      this.shadow.appendChild(section);
      this.shadow.appendChild(style);
    }
  }
);
