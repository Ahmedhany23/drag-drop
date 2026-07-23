export class Base<T extends HTMLElement> {
  private _template!: HTMLTemplateElement;
  public element: T;
  private _hostElement!: HTMLDivElement;

  constructor(
    private _templateId: string,
    private _hostId: string,
    private _positionElementStart: InsertPosition,
    private _elementId: string,
  ) {
    const [template, _] = this._targetElements(
      this._templateId,
      this._hostId,
    );

    if (!template) {
      throw new Error(`Template with id "${this._templateId}" not found.`);
    }

    const templateContent = document.importNode(template.content, true);

    this.element = templateContent.firstElementChild! as T;
    this.element.id = this._elementId;

    this._hostElement.insertAdjacentElement(
      this._positionElementStart,
      this.element,
    );
  }

  /** @desc  get the template and host element
   * @param1 temlateId
   * @param2 hostId
   * @returns [HTMLTemplateElement, HTMLDivElement]
   */

  private _targetElements(
    templateId: string,
    hostId: string,
  ): [HTMLTemplateElement, HTMLDivElement] {
    this._template = document.getElementById(templateId) as HTMLTemplateElement;
    this._hostElement = document.getElementById(hostId) as HTMLDivElement;

    if (!this._hostElement) {
      throw new Error(`Host element with id "${hostId}" not found.`);
    }

    return [this._template, this._hostElement];
  }
}
