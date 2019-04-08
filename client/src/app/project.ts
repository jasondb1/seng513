import {User} from "./user";
import {Invoice} from "./invoice";
export class Project {
  id: Number;
  description: string;
  status: string;
  employees: User[];
  projectManager: string;
  dateCreated: Date;
  invoice: Invoice[];

  constructor() {}

}
