import { projectStatus } from "../utils/project-status.js";
import { Listnertype } from "./ListnerType.js";
import { ProjectRules } from "./ProjectRules.js";

class ProjectState {
  private static _instance: ProjectState;
  private _projects: ProjectRules[] = [];
  private _listners: Listnertype[] = [];
  private _localStorageProjects: ProjectRules[] = localStorage.getItem(
    "projects",
  )
    ? JSON.parse(localStorage.getItem("projects")!)
    : [];

  constructor() {
    // * when refresh page send localStorage Projects to projects state
    this._projects = this._localStorageProjects;
  }

  /**
   * @desc  create a singleton instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new ProjectState();
    }
    return this._instance;
  }

  /**
   * @desc create a project
   * @param1 title :string
   * @param2 desc :string
   */
  public createProject(title: string, desc: string) {
    const newProject = new ProjectRules(
      Math.random().toString(),
      title,
      desc,
      projectStatus.Intial,
    );

    this._projects.push(newProject);

    this._runListners();

    localStorage.setItem("projects", JSON.stringify(this._projects));
  }

  /**
   * @desc delete a project and update the projects array
   * @param projectId :string
   */

  public deleteProject(projectId: string): void {
    const projectsAfterDelete = this._projects.filter(
      (project) => project.id !== projectId,
    );

    this._projects = projectsAfterDelete;

    this._runListners();

    localStorage.setItem("projects", JSON.stringify(this._projects));
  }

  public changeProjectStatus(
    projectId: string,
    newStatus: projectStatus | false,
  ): void {
    const project = this._projects.find((project) => project.id === projectId)!;
    if (project && project.status !== newStatus) {
      project!.status = newStatus ? newStatus : project!.status;
      this._runListners();
      localStorage.setItem("projects", JSON.stringify(this._projects));
    }
  }

  /**
   * @desc pushing listners in array
   * @param listner: Function
   */

  public pushListener(listener: Listnertype) {
    this._listners.push(listener);
  }

  /**
   * @desc Run all listners function and pass the projects array to them
   */

  private _runListners() {
    for (const listner of this._listners) {
      listner([...this._projects]);
    }
  }
}

export const projectState = ProjectState.getInstance();
