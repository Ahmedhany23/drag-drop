import { autoBind } from "../decorators/autoBind.js";
import { ProjectRules } from "../store/ProjectRules.js";
import { projectState } from "../store/ProjectState.js";
import { Base } from "./Base.js";

export class Project extends Base<HTMLDivElement> {
  private _project: ProjectRules;

  constructor(projectsListId: string, project: ProjectRules) {
    super("project-item", projectsListId, "beforeend", project.id);

    this._project = project;

    this._renderProject();

    this._deleteProject();

    this._editProject();

    this._runDragging();
  }

  /**
   * @desc render project
   */

  private _renderProject(): void {
    const title = this.element.querySelector(
      ".project_title",
    )! as HTMLHeadingElement;
    const desc = this.element.querySelector(
      ".project_desc",
    )! as HTMLParagraphElement;

    title.textContent = this._project.title;
    desc.textContent = this._project.desc;
  }

  /**
   * @desc delete project
   */

  private _deleteProject(): void {
    const deleteButton = this.element.querySelector(
      ".delete",
    )! as HTMLButtonElement;
    deleteButton.addEventListener("click", this._handleDeleteProject);
  }

  /**
   * @desc delete handler
   */

  @autoBind
  private _handleDeleteProject(): void {
    if (confirm("Are you sure you want to delete this project?")) {
      projectState.deleteProject(this._project.id);
    }
  }

  /**
   * @desc edit project
   */

  private _editProject(): void {
    const editButton = this.element.querySelector(
      ".edit",
    )! as HTMLButtonElement;
    editButton.addEventListener("click", this._handleEditProject);
  }

  /**
   * @desc edit handler
   */

  @autoBind
  private _handleEditProject(): void {
    const title = prompt("Enter new project name", this._project.title) as string;
    const desc = prompt("Enter new project description", this._project.desc) as string;

    if (!title) alert("project name can't be empty");
    if (!desc) alert("project description can't be empty");

    const value=  { title, desc }

    projectState.editProject(this._project.id, value);
  }

  private _runDragging(): void {
    this.element.addEventListener("dragstart", this._handleDragStart);
    this.element.addEventListener("dragend", this._handleDragEnd);
  }

  @autoBind
  private _handleDragStart(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this._project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autoBind
  private _handleDragEnd(event: DragEvent): void {
    event.preventDefault();
  }
}
