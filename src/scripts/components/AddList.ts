import { autoBind } from "../decorators/autoBind.js";
import { projectState } from "../store/ProjectState.js";
import {
  assignListValidateInputs,
  handleValidationErrors,
} from "../utils/validation/validation_helpers.js";
import { Base } from "./Base.js";

export class AddList extends Base<HTMLFormElement> {
  constructor() {
    super("add-list", "app", "afterbegin", "form");

    this._addProject();
    this._renderErrors();
    this._addRealtimeValidation();
  }

  private _addProject(): void {
    this.element.addEventListener("submit", this._handleAddList);
  }

  /**
   * @desc handle add projects
   */

  @autoBind
  private _handleAddList(event: Event): void {
    event.preventDefault();
    const [titleInput] = this._targetInputs();
    const [titleValue] = this._getInputValues(titleInput);

    if (this._validateInputsValues(titleInput, titleValue)) {
      projectState.createList(titleValue);
      this._clearInputsValues(titleInput);
    }
  }

  /**
   * @desc add realtime validation
   */

  private _addRealtimeValidation(): void {
    const [titleInput] = this._targetInputs();

    const validate = () => {
      this._validateInputsValues(titleInput, titleInput.value);
    };

    titleInput.addEventListener("input", validate);
  }

  /**
   * @desc get project inputs
   * @returns inputs [titleInput, descInput]: HTMLInputElement[]
   */

  private _targetInputs(): HTMLInputElement[] {
    const titleInput = this.element.querySelector(
      "#list-title",
    )! as HTMLInputElement;

    return [titleInput];
  }

  /**
   * @desc get project inputs values
   * @param1 titleInput: HTMLInputElement
   * @returns [title]: string[]
   */

  private _getInputValues(titleInput: HTMLInputElement): string[] {
    const title = titleInput.value;

    return [title];
  }

  /**
   * @desc make validation
   * @param1 titleInput: HTMLInputElement
   * @returns true ? inputs is valid : inputs not valid show error message
   */

  private _validateInputsValues(
    titleInput: HTMLInputElement,
    titleValue: string,
  ) {
    const [titleInputRule] = assignListValidateInputs(titleValue);

    const titleErrorMsg = handleValidationErrors(titleInputRule);

    if (titleErrorMsg) {
      this._showFieldError(titleInput, titleErrorMsg);
    } else {
      this._clearFieldError(titleInput);
    }

    return !titleErrorMsg;
  }

  /**
   * @desc render errors
   * */

  private _renderErrors() {
    const [titleInput] = this._targetInputs();

    titleInput.insertAdjacentElement("afterend", this._createErrorMessage());

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
   */

  private _clearInputsValues(titleInput: HTMLInputElement) {
    titleInput.value = "";
  }
}
