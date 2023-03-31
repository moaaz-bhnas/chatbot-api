class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
      form: document.querySelector(".chatbox__footer"),
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, chatBox, sendButton, form } = this.args;

    form.addEventListener("submit", (e) => e.preventDefault());

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", (key) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatBox) {
    this.state = !this.state;

    if (this.state) {
      chatBox.classList.add("chatbox--active");
    } else {
      chatBox.classList.remove("chatbox--active");
    }
  }

  onSendButton(chatbox) {
    const textField = chatbox.querySelector("input");
    const text1 = textField.value;
    if (text1 === "") {
      return;
    }

    const msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    fetch($SCRIPT_ROOT + "/predict", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        const msg2 = { name: "Sam", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.log({ error });
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatBox) {
    let html = "";
    this.messages
      .slice()
      .reverse()
      .forEach((item, index) => {
        if (item.name === "Sam") {
          html += `<div class="message__item message__item--visitor">
                      ${item.message}
                  </div>`;
        } else {
          html += `<div class="message__item message__item--operator">
                      ${item.message}
                  </div>`;
        }

        const chatMessage = chatBox.querySelector(".chatbox__messages");
        chatMessage.innerHTML = html;
      });
  }
}

const chatbox = new Chatbox();
chatbox.display();
