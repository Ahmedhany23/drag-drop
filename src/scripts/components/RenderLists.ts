import { projectState } from "../store/ProjectState.js";
import { Ilist } from "../utils/list.types.js";
import { Base } from "./Base.js";
import { ProjectsList } from "./ProjectsList.js";

export class RenderLists extends Base<HTMLDivElement> {

  constructor() {
    super("project-lists", "app", "beforeend", `projects`);

    // * when refresh page get all lists from localStorage and show them

    if (JSON.parse(localStorage.getItem("lists")!)) {
      const localStorageLists = JSON.parse(
        localStorage.getItem("lists")!,
      );
      this._renderProjectLists(localStorageLists);
    }

    projectState.pushListListener((lists: Ilist[]) => {
      this._renderProjectLists(lists);
    });
  }

  private _renderProjectLists(lists: Ilist[]): void {
    this.element.innerHTML = "";
    
    for (const list of lists) {
      new ProjectsList(list);
    }
  }
}
