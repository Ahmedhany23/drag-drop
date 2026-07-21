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

    if (this._validateInputsValues(titleValue, descValue)) {
      projectState.createProject(titleValue, descValue);
      this._clearInputsValues(titleInput, descInput);
    }
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
   * @param1 titleValue :string
   * @param2 descValue :string
   * @returns true ? inputs is valid : inputs not valid show error message
   */

  private _validateInputsValues(titleValue: string, descValue: string) {
    const [titleInputRule, descInputRule] = assignValidateInputs(
      titleValue,
      descValue,
    );
    const titleErrorMsg = handleValidationErrors(titleInputRule);
    const descErrorMsg = handleValidationErrors(descInputRule);
    // target poup
    const popupContainer = document.getElementById(
      "popup_container",
    )! as HTMLDivElement;
    const descPopup = document.querySelector(
      ".desc_popup",
    )! as HTMLParagraphElement;

    if (titleErrorMsg.length) {
      popupContainer.classList.add("visible_popup");
      descPopup.textContent = titleErrorMsg;
      return false;
    } else if (descErrorMsg.length) {
      popupContainer.classList.add("visible_popup");
      descPopup.textContent = descErrorMsg;
      return false;
    }
    return true;
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
