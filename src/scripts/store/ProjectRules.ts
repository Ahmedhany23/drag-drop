import { Ilist } from "../utils/list.types";

export class ProjectRules {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public listId: Ilist["id"],
  ) {}
}
