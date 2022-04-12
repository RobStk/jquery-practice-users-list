class FormPanel {
  /**
   * Function exist only for standarization. You can use the constructor instead.
   */
  static async create(mainElement) {
    return new FormPanel(mainElement);
  }

  constructor(mainElement) {
    this.#$mainElement = $(mainElement);
    this.#createHTML();
  }
  #$mainElement;
  #screenSize;
  #$formElement;
  #$inputsContainer
  #$firstNameInput;
  #$lastNameInput;
  #$emailInput;
  #$formContent;

  get screenSize() {
    return this.#screenSize;
  }
  set screenSize(newScreenSize) {
    this.#screenSize = newScreenSize;
  }

  get $formElement() {
    return this.#$formElement;
  }
  get formElement() {
    return this.#$formElement.get(0);
  }

  get $inputsContainer() {
    return this.#$inputsContainer;
  }
  get inputsContainer() {
    return this.#$inputsContainer.get(0);
  }

  get $firstNameInput() {
    return this.#$firstNameInput;
  }
  get firstNameInput() {
    return this.#$firstNameInput.get(0);
  }

  get $lastNameInput() {
    return this.#$lastNameInput;
  }
  get lastNameInput() {
    return this.#$lastNameInput.get(0);
  }

  get $emailInput() {
    return this.#$emailInput;
  }
  get emailInput() {
    return this.#$emailInput.get(0);
  }

  #createHTML() {
    // Form main element
    this.#$formElement = $('<form class="tile add-user-form"></form>');

    // Form main element children
    const $formHeader = $('<div class="users-inputs-header">Dodaj nowego użytkownika</div>');
    this.#$formContent = $('<div class="form-content form-content-large row-gap-1rem column-gap-1rem"></div>');
    this.#$formElement.append($formHeader, this.#$formContent);

    // Form content children
    const $inputsContainer = $('<div class="inputs-container grid-col-3 column-gap-1rem"></div>');
    const $buttonContainer = $('<div class="input-container button-container"></div>');
    this.#$formContent.append($inputsContainer, $buttonContainer);

    // ********************** //
    // *** Imputs section *** //
    // - first name
    const $firstNameInputsContainer = $('<div class="input-container"></div>');
    const $firstNameLabel = $('<label class="form-label" for="firstName">Imię:</label>');
    const $firstNameInput = $('<input type="text" minlength="3" required id="firstName">');
    $firstNameInputsContainer.append($firstNameLabel, $firstNameInput);
    // - last name
    const $lastNameInputsContainer = $('<div class="input-container"></div>');
    const $lastNameLabel = $('<label class="form-label" for="lastName">Nazwisko:</label>');
    const $lastNameInput = $('<input type="text" minlength="3" required id="lastName">');
    $lastNameInputsContainer.append($lastNameLabel, $lastNameInput);
    // - email
    const $emailInputsContainer = $('<div class="input-container"></div>');
    const $emailLabel = $('<label class="form-label" for="email">Email:</label>');
    const $emailInput = $('<input type="email" required id="email">');
    $emailInputsContainer.append($emailLabel, $emailInput);

    $inputsContainer.append($firstNameInputsContainer, $lastNameInputsContainer, $emailInputsContainer);
    // ********************** //

    // ********************* //
    // *** Button section *** //
    const $submitButton = $('<input type="submit" class="submit-button" value="Dodaj">');
    $buttonContainer.append($submitButton);
    // ********************* //

    this.#$mainElement.prepend(this.#$formElement);

    this.#$inputsContainer = $inputsContainer
    this.#$firstNameInput = $firstNameInput;
    this.#$lastNameInput = $lastNameInput;
    this.#$emailInput = $emailInput;
  }

  setSize() {
    switch (this.#screenSize) {
      case "full":
        this.#$formContent.removeClass("form-content-small");
        this.#$formContent.addClass("form-content-large",);
        this.#$inputsContainer.removeClass("grid-col-1");
        this.#$inputsContainer.addClass("grid-col-3");
        break;
      case "medium", "small":
        this.#$formContent.removeClass("form-content-small");
        this.#$formContent.addClass("form-content-large");
        this.#$inputsContainer.removeClass("grid-col-1");
        this.#$inputsContainer.addClass("grid-col-3");
        break;
      case "xsmall":
        this.#$formContent.removeClass("form-content-large");
        this.#$formContent.addClass("form-content-small");
        this.#$inputsContainer.removeClass("grid-col-3");
        this.#$inputsContainer.addClass("grid-col-1");
        break;
    }
  }
}
export { FormPanel };