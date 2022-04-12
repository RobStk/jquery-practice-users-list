class UsersList {
  static async create(parentElement, query) {
    const usersArr = await query.getData();
    return new UsersList(parentElement, query, usersArr);
  }
  constructor(parentElement, query, usersArr) {
    if (!(usersArr instanceof Array)) {
      console.error('Instance of UsersList must be create by "create()" static async function.');
    }
    this.#query = query;
    this.#usersArr = usersArr;
    if ($(parentElement).find('.users').length == 0) {
      const $newUsersListElement = $('<ul class="users"></ul>');
      $(parentElement).append($newUsersListElement);
    }
    this.#$mainElement = $(parentElement).find('.users');
    try {
      this.#createList();
      this.#addListeners();
    } catch (error) {
      console.error("Data reading error detected.")
      console.error(error);
    }
  }

  #query
  #usersArr;
  #screenSize;
  #$mainElement

  get screenSize() {
    return this.#screenSize;
  }
  set screenSize(newScreenSize) {
    this.#screenSize = newScreenSize;
  }
  get mainElement() {
    return this.#$mainElement.get(0);
  }
  get $mainElement() {
    return this.#$mainElement;
  }

  async #getUsers() {
    this.#usersArr = await this.#query.getData();
  }

  #createList() {
    this.#$mainElement.empty();
    this.#$mainElement.addClass("users");
    this.#$mainElement.addClass("grid-col-3");
    this.#usersArr.forEach(user => {
      const $li = this.#createUserFrame(user);
      this.#$mainElement.prepend($li);
    });
    this.setSize();
  }

  #createUserFrame(user) {
    // first name section
    const $nameLabel = $('<div class="firstname-label">Imię:</div>');
    const $nameContent = $('<div class="firstname-content"></div>');
    $nameContent.text(user.first_name);

    // last name section
    const $surnameLabel = $('<div class="lastname-label">Nazwisko:</div>');
    const $surnameContent = $('<div class="lastname-content"></div>');
    $surnameContent.text(user.last_name);

    // email section
    const $emailLabel = $('<div class="email-label">Email:</div>');
    const $emailContent = $('<div class="email-content"></div>');
    $emailContent.text(user.email);

    // user container section
    const $userContainer = $('<div class="user-container"></div>');
    $userContainer.append($nameLabel, $nameContent, $surnameLabel, $surnameContent, $emailLabel, $emailContent);

    // buttons container section
    const $editButton = $('<button class="button-edit" title="edytuj"><img src="images/icon-edit.svg"></button>');
    const $deleteButton = $('<button class="button-delete" title="usuń"><img src="images/icon-delete.svg"></button>');

    const $buttonsContainer = $('<div class="grid-col-2 gap-03rem"></div>');
    $buttonsContainer.append($editButton, $deleteButton);

    const $form = $('<form class="grid-col-2 column-gap-05rem space-between"></form>');
    $form.append($userContainer, $buttonsContainer);
    const id = 'user' + user.id;
    const $li = $('<li class="tile" id=' + id + '></li>');

    $li.append($form);

    return $li;
  }

  #addListeners() {
    this.#$mainElement.off('click');
    this.#$mainElement.on('click', this.#selectBtnFunction.bind(this));
    this.#$mainElement.on('submit', this.#userEditAccept.bind(this));
  }

  #selectBtnFunction(event) {
    event.preventDefault();
    if ($(event.target).hasClass('button-edit')) {
      this.#userEdit(event);
    }
    if ($(event.target).hasClass('button-delete')) {
      this.#userDelete(event);
    }
    if ($(event.target).hasClass('button-accept')) {
      const $form = $(event.target).parents("form");
      $form.get(0).requestSubmit();
      //this.#userEditAccept(event);
    }
    if ($(event.target).hasClass('button-cancel')) {
      this.#userEditCancel(event);
    }
  }

  #userEdit(event) {
    const $li = $(event.target).parents('li');
    const userId = $li.attr('id');
    if (userId.substr(0, 4) === "user") {
      const $firstNameDiv = $li.find(".firstname-content");
      const $lastNameDiv = $li.find(".lastname-content");
      const $emailDiv = $li.find(".email-content");

      const firstName = $firstNameDiv.text();
      const lastName = $lastNameDiv.text();
      const email = $emailDiv.text();

      const $firstNameInput = $('<input type="text" minlength="3" required id="fnameEdit" value="' + firstName + '">');
      const $lastNameInput = $('<input type="text" minlength="3" required id="lnameEdit" value="' + lastName + '">');
      const $emailInput = $('<input type="email" required id="emailEdit" value="' + email + '">');

      $firstNameDiv.replaceWith($firstNameInput);
      $lastNameDiv.replaceWith($lastNameInput);
      $emailDiv.replaceWith($emailInput);

      const $editButton = $li.find(".button-edit");
      const $deleteButton = $li.find(".button-delete");

      const $acceptButton = $('<button class="button-accept"><img src="images/icon-edit-save.svg"></button>');
      const $cancelButton = $('<button class="button-cancel"><img src="images/icon-edit-cancel.svg"></button>');

      $editButton.replaceWith($acceptButton);
      $deleteButton.replaceWith($cancelButton);
    }
    else {
      console.log("Ooops, something went wrong...");
    }

  }

  async #userDelete(event) {
    const $li = $(event.target).parents('li');
    const userId = $li.attr('id');
    const dbId = userId.substr(4);
    await this.#query.delete(dbId);
    await this.#getUsers();
    this.#createList();
  }

  async #userEditAccept(event) {
    event.preventDefault();
    const $li = $(event.target).parents('li');
    const userId = $li.attr('id');
    const dbId = userId.substr(4);
    this.#usersArr = await this.#query.getData();
    const user = this.#usersArr.find(u => u.id == dbId);
    const firstName = $li.find("#fnameEdit").val();
    const lastName = $li.find("#lnameEdit").val();
    const email = $li.find("#emailEdit").val();
    user.first_name = firstName;
    user.last_name = lastName;
    user.email = email;
    await this.#query.putData(dbId, user);
    const li = this.#createUserFrame(user);
    $li.replaceWith(li);
  }

  #userEditCancel(event) {
    const $li = $(event.target).parents('li');
    const userId = $li.attr('id');
    const dbId = userId.substr(4);
    const user = this.#usersArr.find(u => u.id == dbId);
    const li = this.#createUserFrame(user);
    $li.replaceWith(li);
  }

  setSize() {
    switch (this.#screenSize) {
      case "full":
        this.#$mainElement.removeClass(["grid-col-2", "grid-col-1"]);
        this.#$mainElement.find(".user-container").removeClass("size-xs");
        this.#$mainElement.addClass("grid-col-3");
        break;
      case "medium":
        this.#$mainElement.removeClass(["grid-col-3", "grid-col-1"]);
        this.#$mainElement.find(".user-container").removeClass("size-xs");
        this.#$mainElement.addClass("grid-col-2");
        break;
      case "small":
        this.#$mainElement.removeClass(["grid-col-2", "grid-col-3"]);
        this.#$mainElement.find(".user-container").removeClass("size-xs");
        this.#$mainElement.addClass("grid-col-1");
        break;
      case "xsmall":
        this.#$mainElement.removeClass(["grid-col-2", "grid-col-3"]);
        this.#$mainElement.addClass("grid-col-1");
        this.#$mainElement.find(".user-container").addClass("size-xs");
    }
  }
}

export { UsersList };