import { FormPanel } from "./form-panel.js";
import { UsersList } from "./users-list.js";

class UsersAdmPanel {
  static async create(mainElement, query, opts) {
    const usersList = await UsersList.create(mainElement, query);
    return new UsersAdmPanel(mainElement, query, usersList, opts);
  }

  constructor(mainElement, query, usersList, opts) {
    const defaultOpts = {
      scrnSmBreakpoint: "576px",
      scrnMdBreakpoint: "768px",
      scrnLgBreakpoint: "992px",
      scrnXlBreakpoint: "1200px"
    }
    this.#options = Object.assign(defaultOpts, opts);
    this.#$mainElement = $(mainElement);
    this.#query = query;
    this.#usersList = usersList;
    this.#xSmallSizeQuery = window.matchMedia("(max-width: " + this.#options.scrnSmBreakpoint + ")");
    this.#mediumSizeQuery = window.matchMedia("(min-width: " + this.#options.scrnMdBreakpoint + ")");
    this.#largeSizeQuery = window.matchMedia("(min-width: " + this.#options.scrnXlBreakpoint + ")");
    this.#createFormPanel();
    this.#setSize();
    this.#addListeners();
  }

  #$mainElement;
  #query;
  #options;
  #formPanel
  #$formElement
  #$firstNameInput;
  #$lastNameInput;
  #$emailInput;
  #usersList;
  #xSmallSizeQuery;
  #mediumSizeQuery;
  #largeSizeQuery;

  #createFormPanel() {
    this.#formPanel = new FormPanel(this.#$mainElement);
    this.#$formElement = this.#formPanel.$formElement;
    this.#$firstNameInput = this.#formPanel.$firstNameInput;
    this.#$lastNameInput = this.#formPanel.$lastNameInput;
    this.#$emailInput = this.#formPanel.$emailInput;
  }

  async #createUsersList() {
    await UsersList.create(this.#$mainElement, this.#query);
    this.#setSize();
  }

  async #addUser(event) {
    event.preventDefault();
    let wrongData = 0;
    this.#$firstNameInput.removeClass("input-wrong");
    this.#$lastNameInput.removeClass("input-wrong");
    this.#$emailInput.removeClass("input-wrong");

    const firstName = this.#$firstNameInput.val();
    const lastName = this.#$lastNameInput.val();
    const email = this.#$emailInput.val();

    if (firstName == null || firstName == undefined || firstName == "") {
      wrongData = 1;
      this.#$firstNameInput.addClass("input-wrong");
    }
    if (lastName == null || lastName == undefined || lastName == "") {
      wrongData = 1;
      this.#$lastNameInput.addClass("input-wrong");
    }
    if (email == null || email == undefined || email == "") {
      wrongData = 1;
      this.#$emailInput.addClass("input-wrong");
    }

    if (wrongData === 0) {
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email
      }
      await this.#query.postData(newUser);
      this.#$firstNameInput.val("");
      this.#$lastNameInput.val("");
      this.#$emailInput.val("");
      await this.#createUsersList();
      const $newUserElement = this.#usersList.$mainElement.find("li")[0];
      this.#highlightElement($newUserElement);
    }
  }

  #highlightElement(htmlElement) {
    const $htmlElement = $(htmlElement);
    $htmlElement.addClass('highlighted');
    setTimeout(() => { $htmlElement.removeClass("highlighted") }, 1000)
  }

  #setSize() {
    let screenSize = "small";
    if (this.#xSmallSizeQuery.matches === true) {
      screenSize = "xsmall";
    }
    if (this.#mediumSizeQuery.matches === true) {
      screenSize = "medium";
    }
    if (this.#largeSizeQuery.matches === true) {
      screenSize = "full";
    }
    this.#formPanel.screenSize = screenSize;
    this.#formPanel.setSize();
    this.#usersList.screenSize = screenSize;
    this.#usersList.setSize();
  }

  #addListeners() {
    this.#$formElement.off();
    this.#$formElement.on("submit", async event => { this.#addUser(event) });

    $(this.#mediumSizeQuery).on("change", this.#setSize.bind(this));
    $(this.#largeSizeQuery).on("change", this.#setSize.bind(this));
    $(this.#xSmallSizeQuery).on("change", this.#setSize.bind(this));
  }
}

export { UsersAdmPanel };