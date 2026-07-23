import { autoBind } from "../decorators/autoBind.js";
import { ProjectRules } from "../store/ProjectRules.js";
import { projectState } from "../store/ProjectState.js";
import { Ilist } from "../utils/list.types.js";
import { Base } from "./Base.js";
import { Project } from "./Project.js";

export class ProjectsList extends Base<HTMLDivElement> {
  constructor(private _list: Ilist) {
    super("project-list", "projects", "beforeend", `${_list.id}-projects`);

    this.renderProjectList();

    this._deleteList();

    this._editList();

    // * when refresh page get all projects from localStorage and show them

    if (JSON.parse(localStorage.getItem("projects")!)) {
      const localStorageProjects = JSON.parse(
        localStorage.getItem("projects")!,
      );
      this._showProjectInDom(localStorageProjects);
    }

    projectState.pushListener((projects: ProjectRules[]) => {
      this._showProjectInDom(projects);
    });

    this._runDragging();
  }

  /**
   * @desc render projects list specific own  status
   */

  private renderProjectList(): void {
    const title = this.element.querySelector(".title")! as HTMLHeadingElement;
    const list = this.element.querySelector(
      ".projects-list",
    )! as HTMLUListElement;

    list.id = `${this._list.id}-list`;

    title.textContent = `${this._list.title} Projects`;
  }

  /**
   * @desc delete List
   */

  private _deleteList(): void {
    const deleteButton = this.element.querySelector(
      ".delete",
    )! as HTMLButtonElement;
    deleteButton.addEventListener("click", this._handleDeleteList);
  }

  /**
   * @desc delete handler
   */

  @autoBind
  private _handleDeleteList(): void {
    if (confirm("Are you sure you want to delete this list?")) {
      projectState.deleteList(this._list.id);
    }
  }

  /**
   * @desc delete List
   */

  private _editList(): void {
    const editButton = this.element.querySelector(
      ".edit",
    )! as HTMLButtonElement;
    editButton.addEventListener("click", this._handleEditList);
  }

  /**
   * @desc edit handler
   */

  @autoBind
  private _handleEditList(): void {
    const title = prompt("Enter new list name", this._list.title);

    if (!title) alert("list name can't be empty");

    projectState.editList(this._list.id, title!);
  }

  /**
   * @desc show all projects in dom after filtering
   * @param projects: ProjectRules
   */

  private _showProjectInDom(projects: ProjectRules[]) {
    const filteredProjects = this._filterProjectsStatus(projects);
    this._renderProjects(filteredProjects);
  }

  /**
   * @desc render all projects in project list
   */

  private _renderProjects(projects: ProjectRules[]): void {
    const projectsList = document.getElementById(
      `${this._list.id}-list`,
    )! as HTMLDivElement;

    if (!projectsList) return;

    projectsList.innerHTML = "";
    for (const project of projects) {
      new Project(`${this._list.id}-list`, project);
    }
  }

  /**
   * @desc take project from state and filter that specific project Status add them in projects array to render
   * @param projects : ProjectRules[]
   * @return project after filter
   */

  private _filterProjectsStatus(projects: ProjectRules[]) {
    const filteredProjects = projects.filter((project: ProjectRules) => {
      return project.listId === this._list.id;
    });
    return filteredProjects;
  }

  private _runDragging(): void {
    this.element.addEventListener("dragover", this._handleDragOver);
    this.element.addEventListener("drop", this._handleDrop);
  }

  @autoBind
  private _handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  @autoBind
  private _handleDrop(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    const newListId = this._list.id;

    projectState.changeProjectStatus(projectId, newListId);
  }
}
