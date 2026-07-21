import { autoBind } from "../decorators/autoBind.js";
import { ProjectRules } from "../store/ProjectRules.js";
import { projectState } from "../store/ProjectState.js";
import { projectStatus } from "../utils/project-status.js";
import { Base } from "./Base.js";
import { Project } from "./Project.js";

export class ProjectsList extends Base<HTMLDivElement> {
  constructor(private _status: "Intial" | "Active" | "Finished") {
    super("project-list", "app", "beforeend", `${_status}-projects`);

    this.renderProjectList();

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

    list.id = `${this._status}-list`;

    title.textContent = `${this._status} Projects`;
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
      `${this._status}-list`,
    )! as HTMLDivElement;
    projectsList.innerHTML = "";
    for (const project of projects) {
      new Project(`${this._status}-list`, project);
    }
  }

  /**
   * @desc take project from state and filter that specific project Status add them in projects array to render
   * @param projects : ProjectRules[]
   * @return project after filter
   */

  private _filterProjectsStatus(projects: ProjectRules[]) {
    const filteredProjects = projects.filter((project: ProjectRules) => {
      if (this._status === "Intial") {
        return project.status === projectStatus.Intial;
      } else if (this._status === "Active") {
        return project.status === projectStatus.Active;
      } else if (this._status === "Finished") {
        return project.status === projectStatus.Finished;
      }
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
    const newStatus =
      (this.element.id === "Intial-projects" && projectStatus.Intial) ||
      (this.element.id === "Active-projects" && projectStatus.Active) ||
      (this.element.id === "Finished-projects" && projectStatus.Finished);

    projectState.changeProjectStatus(projectId, newStatus);
  }
}
