import {User} from "./user";
import {Invoice} from "./invoice";
import {PurchaseOrder} from "./purchaseOrder";

export class Project {
  id: Number;
  description: string;
  status: string;
  employees: User[];
  projectManager: string;
  dateCreated: Date;
  invoice: Invoice[];
  purchaseOrder: PurchaseOrder[];
  _id: any;

  constructor() {}

}
