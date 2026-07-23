import { autoBind } from "../decorators/autoBind.js";
import { projectState } from "../store/ProjectState.js";
import { Ilist } from "../utils/list.types.js";
import {
  assignProjectValidateInputs,
  handleValidationErrors,
} from "../utils/validation/validation_helpers.js";
import { Base } from "./Base.js";

export class Fields extends Base<HTMLFormElement> {
  constructor() {
    super("fields", "app", "afterbegin", "form");

    this._addProject();
    this._renderListOptions(projectState.getLists());
    this._renderErrors();
    this._addRealtimeValidation();

    projectState.pushListListener((lists: Ilist[]) => {
      this._renderListOptions(lists);
    });
  }

  private _addProject(): void {
    this.element.addEventListener("submit", this._handleAddProject);
  }

  /**
   * @desc handle add projects
   */

  @autoBind
  private _handleAddProject(event: Event): void {
    event.preventDefault();
    const [titleInput, descInput, selectInput] = this._targetInputs();
    const [titleValue, descValue, listId] = this._getInputValues(
      titleInput,
      descInput,
      selectInput,
    );


    if (
      listId && this._validateInputsValues(titleInput, descInput, titleValue, descValue)
    ) {
      projectState.createProject(titleValue, descValue, listId);
      this._clearInputsValues(titleInput, descInput);
    }
  }

  /**
   * @desc add realtime validation
   */

  private _addRealtimeValidation(): void {
    const [titleInput, descInput] = this._targetInputs();

    const validate = () => {
      this._validateInputsValues(
        titleInput,
        descInput,
        titleInput.value,
        descInput.value,
      );
    };

    titleInput.addEventListener("input", validate);
    descInput.addEventListener("input", validate);
  }

  /**
   * @desc get project inputs
   * @returns inputs [titleInput, descInput]: HTMLInputElement[]
   */

  private _targetInputs(): [
    HTMLInputElement,
    HTMLInputElement,
    HTMLSelectElement,
  ] {
    const titleInput = this.element.querySelector(
      "#project-title",
    )! as HTMLInputElement;
    const descInput = this.element.querySelector(
      "#project-desc",
    )! as HTMLInputElement;
    const selectInput = this.element.querySelector(
      "#select-list",
    )! as HTMLSelectElement;

    return [titleInput, descInput, selectInput];
  }

  
  

  /**
   * @desc get project inputs values
   * @param1 titleInput: HTMLInputElement
   * @param2 descInput: HTMLInputElement
   * @returns [title, desc]: string[]
   */

  private _getInputValues(
    titleInput: HTMLInputElement,
    descInput: HTMLInputElement,
    selectInput: HTMLSelectElement,
  ): string[] {
    const title = titleInput.value;
    const desc = descInput.value;
    const listId = selectInput.value;

    return [title, desc, listId];
  }

  private _renderListOptions(lists: Ilist[]): void {
    const [, , selectInput] = this._targetInputs();

    selectInput.innerHTML = "";

    if (!lists.length) {
      const option = document.createElement("option");

      option.value = "";
      option.textContent = "Create a list first";
      selectInput.append(option);
      selectInput.disabled = true;
      return;
    }

    selectInput.disabled = false;

    for (const list of lists) {
      const option = document.createElement("option");

      option.value = list.id;
      option.textContent = list.title;
      selectInput.append(option);
    }
  }

  /**
   * @desc make validation
   * @param1 titleInput: HTMLInputElement
   * @param2 descInput: HTMLInputElement
   * @param3 titleValue :string
   * @param4 descValue :string
   * @returns true ? inputs is valid : inputs not valid show error message
   */

  private _validateInputsValues(
    titleInput: HTMLInputElement,
    descInput: HTMLInputElement,
    titleValue: string,
    descValue: string,
  ) {
    const [titleInputRule, descInputRule] = assignProjectValidateInputs(
      titleValue,
      descValue,
    );

    const titleErrorMsg = handleValidationErrors(titleInputRule);
    const descErrorMsg = handleValidationErrors(descInputRule);

    if (titleErrorMsg) {
      this._showFieldError(titleInput, titleErrorMsg);
    } else {
      this._clearFieldError(titleInput);
    }

    if (descErrorMsg) {
      this._showFieldError(descInput, descErrorMsg);
    } else {
      this._clearFieldError(descInput);
    }

    return !titleErrorMsg && !descErrorMsg;
  }

  /**
   * @desc render errors
   * */

  private _renderErrors() {
    const [titleInput, descInput] = this._targetInputs();

    titleInput.insertAdjacentElement("afterend", this._createErrorMessage());

    descInput.insertAdjacentElement("afterend", this._createErrorMessage());
  }

  /**
   * @desc create error message
   */

  private _createErrorMessage(): HTMLParagraphElement {
    const errorMessage = document.createElement("p");

    errorMessage.className = "error-message";
    errorMessage.textContent = "";

    return errorMessage;
  }

  /**
   * @desc show error message
   * @param1 inputElement: HTMLInputElement
   * @param2 message: string
   */

  private _showFieldError(inputElement: HTMLInputElement, message: string) {
    const errorElement = inputElement.nextElementSibling as HTMLElement;

    errorElement.textContent = message;
  }

  /**
   * @desc clear error message
   * @param1 inputElement: HTMLInputElement
   */

  private _clearFieldError(inputElement: HTMLInputElement): void {
    const errorElement = inputElement.nextElementSibling as HTMLElement;

    errorElement.textContent = " ";
  }

  /**
   * @desc clear inputs values
   * @param1 titleInput: HTMLInputElement
   * @param2 descInput: HTMLInputElement
   */

  private _clearInputsValues(
    titleInput: HTMLInputElement,
    descInput: HTMLInputElement,
  ) {
    titleInput.value = "";
    descInput.value = "";
  }
}
