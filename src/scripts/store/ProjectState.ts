import { Ilist } from "../utils/list.types.js";
import { ListListnertype } from "./ListListnerType.js";
import { ListModel } from "./listModel.js";

import { Listnertype } from "./ListnerType.js";
import { ProjectRules } from "./ProjectRules.js";

class ProjectState {
  private static _instance: ProjectState;
  private _projects: ProjectRules[] = [];
  private _lists: ListModel[] = [];
  private _listners: Listnertype[] = [];
  private _listListners: ListListnertype[] = [];
  private _localStorageProjects: ProjectRules[] = localStorage.getItem(
    "projects",
  )
    ? JSON.parse(localStorage.getItem("projects")!)
    : [];

  private _localStorageLists: Ilist[] = localStorage.getItem("lists")
    ? JSON.parse(localStorage.getItem("lists")!)
    : [];

  constructor() {
    // * when refresh page send localStorage Projects to projects state
    this._projects = this._localStorageProjects;

    // * when refresh page send localStorage Lists to Lists state
    this._lists = this._localStorageLists;
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
   * @desc create a list
   * @param title :string
   */

  public getLists(): Ilist[] {
    return this._lists;
  }

  /**
   * @desc create a list
   * @param title :string
   */

  public createList(title: string): void {
    const newList = new ListModel(Math.random().toString(), title);

    this._lists.push(newList);

    this._runListListners();

    localStorage.setItem("lists", JSON.stringify(this._lists));
  }

  /**
   * @desc delete a project and update the projects array
   * @param projectId :string
   */

  public deleteList(listId: string): void {
    const listsAfterDelete = this._lists.filter((list) => list.id !== listId);
    const projectsAfterDelete = this._projects.filter(
      (project) => project.listId !== listId,
    );

    this._lists = listsAfterDelete;
    this._projects = projectsAfterDelete;

    this._runListListners();
    this._runListners();

    localStorage.setItem("lists", JSON.stringify(this._lists));
    localStorage.setItem("projects", JSON.stringify(this._projects));
  }

  /**
   * @desc edit a list
   * @param listId :string
   * @param title :string
   */

  public editList(listId: string, title: string): void {
    this._lists = this._lists.map((list) =>
      list.id === listId ? { ...list, title } : list,
    );

    this._runListListners();

    localStorage.setItem("lists", JSON.stringify(this._lists));
  }

  /**
   * @desc create a project
   * @param1 title :string
   * @param2 desc :string
   */
  public createProject(
    title: string,
    desc: string,
    listId?: Ilist["id"],
  ): void {
    // target poup
    const popupContainer = document.getElementById(
      "popup_container",
    )! as HTMLDivElement;
    const descPopup = document.querySelector(
      ".desc_popup",
    )! as HTMLParagraphElement;

    if (!this._lists.length) {
      popupContainer.classList.add("visible_popup");
      descPopup.textContent = "create a list first";
      return;
    }

    if (!listId) listId = this._lists[0].id;

    const newProject = new ProjectRules(
      Math.random().toString(),
      title,
      desc,
      listId,
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

  /**
   * @desc edit a project and update the projects array
   * @param projectId :string
   */

  public editProject(
    projectId: string,
    value: { title: string; desc: string },
  ): void {
    const projectsAfterEdit = this._projects.map((project) =>
      project.id === projectId ? { ...project, ...value } : project,
    );

    this._projects = projectsAfterEdit;

    this._runListners();

    localStorage.setItem("projects", JSON.stringify(this._projects));
  }

  public changeProjectStatus(projectId: string, newListId: Ilist["id"]): void {
    const project = this._projects.find((project) => project.id === projectId)!;
    if (project && project.listId !== newListId) {
      project!.listId = newListId;
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
   * @desc pushing listners in array
   * @param listner: Function
   */
  public pushListListener(listener: ListListnertype) {
    this._listListners.push(listener);
  }

  /**
   * @desc Run all listners function and pass the projects array to them
   */

  private _runListners() {
    for (const listner of this._listners) {
      listner([...this._projects]);
    }
  }

  /**
   * @desc Run all listners function and pass the lists array to them
   */
  private _runListListners() {
    for (const listner of this._listListners) {
      listner([...this._lists]);
    }
  }
}

export const projectState = ProjectState.getInstance();
