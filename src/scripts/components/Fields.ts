import { autoBind } from "../decorators/autoBind.js";
import { projectState } from "../store/ProjectState.js";
import {
  assignValidateInputs,
  handleValidationErrors,
} from "../utils/validation/validation_helpers.js";
import { Base } from "./Base.js";

export class Fields extends Base<HTMLFormElement> {
  constructor() {
    super("fields", "app", "afterbegin", "form");

    this._addProject();
    this._renderErrors();
    this._addRealtimeValidation();
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
    const [titleInput, descInput] = this._targetInputs();
    const [titleValue, descValue] = this._getInputValues(titleInput, descInput);

    if (
      this._validateInputsValues(titleInput, descInput, titleValue, descValue)
    ) {
      projectState.createProject(titleValue, descValue);
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

  private _targetInputs(): HTMLInputElement[] {
    const titleInput = document.getElementById("title")! as HTMLInputElement;
    const descInput = document.getElementById("desc")! as HTMLInputElement;

    return [titleInput, descInput];
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
  ): string[] {
    const title = titleInput.value;
    const desc = descInput.value;

    return [title, desc];
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
    const [titleInputRule, descInputRule] = assignValidateInputs(
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
