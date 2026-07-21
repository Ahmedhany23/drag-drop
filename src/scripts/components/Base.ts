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
    this._template = document.getElementById(
      templateId,
    )! as HTMLTemplateElement;
    this._hostElement = document.getElementById(hostId)! as HTMLDivElement;

    return [this._template, this._hostElement];
  }

  
}
