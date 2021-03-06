import {Component, OnInit} from '@angular/core';
//import $ from 'jquery';
import {TableService} from "../table.service";
import {Project} from "../project";
import {DataService} from "../data.service";
import {Invoice} from "../invoice";
import {Task} from "../task";
import {User} from "../user";
import {ConfigService} from "../config.service";
import {PurchaseOrder} from "../purchaseOrder";

declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  project: Project;
  selectedProject: Project;
  projects: Project[];
  users: User[];
  displayUsers = new Array();
  displayForm: boolean = false;
  invoice: Invoice;
  task: Task;
  purchaseOrder: PurchaseOrder;
  DEBUG: boolean = true;
  data: any = {};
  isUserAdmin: boolean = ConfigService.isAdmin;
  projIndex: Number = 0;
  //selectedUsers: User[];

  constructor(private dataService: DataService,
              private configService: ConfigService) {
    this.project = <Project>{};
    this.selectedProject = <Project>{};
    this.invoice = <Invoice>{};
    this.purchaseOrder =<PurchaseOrder>{};
    this.task = <Task>{};

  }

  ngOnInit() {
    this.project = new Project;
    this.invoice = new Invoice;
    this.purchaseOrder = new PurchaseOrder;
    this.task = new Task;
    //update the table
    this.updateTable();
    this.employeesDisplay();
  }

  /////////////////////////
  // resetForm()

  resetForm(): void {
    this.project = new Project();
    this.invoice = new Invoice();
    this.purchaseOrder = new PurchaseOrder();
    this.task = new Task();
  }

  /////////////////////////
  // displaySelected()

  displaySelected(index){

    this.projIndex = index;
    this.selectedProject = this.projects[index];
    this.displayUsers.length = 0; //reset the array lol this is an interesting way to code this.

    if(this.selectedProject.employees.length !== undefined) {
      //array to popualte displayUsers
      let count = 0;
      for (let i = 0; i < this.selectedProject.employees.length; i++) {
        for (let j = 0; j < this.users.length; j++) {
          if (this.selectedProject.employees[i] === this.users[j]._id) {
            this.displayUsers.push(this.users[j]);
            count++;
            break;
          }
        }
      }
    }

    this.displayTable2();
  }


  ///////////////////////////
  // setupRowListener()

  setupRowListener(): void {

    $('#table-summary tr').on('mouseover', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      if (rowId !== null) {
        rowId = rowId.match(regex)[0];
        this.displaySelected(rowId);
      }
    });
  }

  ///////////////////////////
  // setupDeleteListener()

  setupDeleteListener(): void {

    $('a.btn-delete').on('click', event => {

      event.preventDefault();

      let isConfirmed = confirm('Delete This Project');

      if (isConfirmed) {
        let id = event.currentTarget.href;
        let regex = /[^/]+$/; //matches everything after the last / to get the id
        id = id.match(regex);

        this.dataService.deleteProject(id[0]).subscribe((res: any) => {

            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-success');

          },
          (res: any) => {
            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-danger');
          },
          () => {
            this.updateTable();
          });
      }
    });

  }

  ///////////////////////////
  // setupEditListener()

  setupEditListener(): void {

    $('#table-summary a.btn-edit').on('click', event => {
      event.preventDefault();

      this.project = this.selectedProject;
      this.displayForm = true;

      $('#form-modal').modal('show');

    });


  };


  ////////////////
  // displayTable()

  displayTable(): void {
    let html = TableService.tableHtml(this.projects, {'id': 'ID', 'description': 'Description'}, true, true);
    $('#table-summary').html(html);

    this.setupDeleteListener();
    this.setupRowListener();
    this.setupEditListener();

  }

  displayTable2(): void {

    let html = TableService.tableHtml(this.selectedProject.invoice, {'status' : 'Status', 'description': 'Description', 'dateCreated': 'Invoice Date', 'totalCost' : 'Price', 'seller' : "Vendor"}, true, true);
    $('#invoice-summary').html(html);

    html = TableService.tableHtml(this.displayUsers, {'username': 'User Name', 'name_first' : 'First Name', 'name_last': 'Last Name', 'email': 'Email'}, false, false);
    $('#employee-summary').html(html);

    html = TableService.tableHtml(this.selectedProject.task, {'description': 'Description', 'status' : 'Status', 'time' : 'hours'}, true, true);
    $('#task-summary').html(html);

    html = TableService.tableHtml(this.selectedProject.purchaseOrder, {'status' : 'Status', 'description': 'Description', 'dateCreated': 'Invoice Date', 'totalCost' : 'Cost', 'buyer' : "Customer"}, true, true);
    $('#purchase-summary').html(html);

    $('#task-summary a.btn-edit').on('click', event => {
      event.preventDefault();

      $('#form-modal-task').modal('show');

    });

    $('#invoice-summary a.btn-edit').on('click', event => {
      event.preventDefault();

      $('#form-modal-invoice').modal('show');

    });

    $('#purchase-summary a.btn-edit').on('click', event => {
      event.preventDefault();
      $('#form-modal-po').modal('show');

    });


    //listen to the rows
    $('#invoice-summary tr').on('mouseover', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      //needed for edit function.
      if (rowId != null) {
        rowId = rowId.match(regex)[0];
        this.invoice = this.selectedProject.invoice[rowId];
      }

    });

    //listen to the task rows
    $('#task-summary tr').on('mouseover', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      //needed for edit function.
      if (rowId != null) {
        rowId = rowId.match(regex)[0];
        this.task = this.selectedProject.task[rowId];
      }

    });


    //listen to the rows
    $('#purchase-summary tr').on('mouseover', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      //needed for edit function.
      if (rowId != null) {
        rowId = rowId.match(regex)[0];
        this.purchaseOrder = this.selectedProject.purchaseOrder[rowId];
      }

    });

    
    //delete invoice
    $('#invoice-summary a.btn-delete').on('click', event => {
      event.preventDefault();

      let isConfirmed = confirm('Delete This Invoice?');

      if (isConfirmed) {

        let id = event.currentTarget.href;
        let regex = /[^/]+$/; //matches everything after the last / to get the id
        id = id.match(regex);

        this.dataService.deleteInvoice(id[0]).subscribe((res: any) => {

            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-success');

          },
          (res: any) => {
            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-danger');
          },
          () => {
            this.updateTable();
          });
      }
    });

    //delete task
    $('#task-summary a.btn-delete').on('click', event => {
      event.preventDefault();

      let isConfirmed = confirm('Delete This Task?');

      if (isConfirmed) {

        let id = event.currentTarget.href;
        let regex = /[^/]+$/; //matches everything after the last / to get the id
        id = id.match(regex);

        this.dataService.deleteTask(id[0]).subscribe((res: any) => {

            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-success');

          },
          (res: any) => {
            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-danger');
          },
          () => {
            this.updateTable();
          });
      }
    });


    //delete poo
    $('#purchase-summary a.btn-delete').on('click', event => {
      event.preventDefault();

      let isConfirmed = confirm('Delete This PO?');

      if (isConfirmed) {

        let id = event.currentTarget.href;
        let regex = /[^/]+$/; //matches everything after the last / to get the id
        id = id.match(regex);

        this.dataService.deletePo(id[0]).subscribe((res: any) => {

            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-success');

          },
          (res: any) => {
            let status = `<strong>${res.status}</strong> - ${res.message}`;
            $("#status").html(status).attr('class', 'alert alert-danger');
          },
          () => {
            this.updateTable();
          });
      }
    });

  }

  ////////////////
  // updateTable()

  updateTable(): void {

    this.dataService.getProjects(this.configService.currentUser)
      .subscribe(
        (res: any[]) => {
          this.projects = res;
        },
        (err) => {
          //Display error in status area
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          this.displayTable();
          this.displayTable2();
          //console.log (this.selectedProject);
          this.displaySelected(this.projIndex);
        }
      );
  }

  ///////////////////////////////////////
  //Submit Form

  submitForm(): void {
    //Add new user

    this.displayForm = false;
    $("#form-modal").modal("hide");

    // if (this.DEBUG) {
    //   console.log("Submit Button Pressed");
    // }

    //2 way data-binding
    let _id = this.project._id;
    let description: string = this.project.description;
    let projectManager: string = this.project.projectManager;
    let employees: User[] = this.project.employees;
    let status: string = this.project.status;

    //Edit an existing Project
    if (_id != null) {
      this.selectedProject.description = description;
      this.selectedProject.projectManager = projectManager;
      this.selectedProject.employees = employees;
      this.selectedProject.status = status;

      //submit the data to the database via the dataService
      this.dataService.editProject(this.selectedProject).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');
        },
        (err: any) => {

          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          $("#form-modal").modal("hide");

          this.updateTable();
        }
      );

    }
    else {
      let dateCreated = new Date();

      let newProject: Project = {
        '_id': -1,
        'id': -1,
        'description': description,
        'employees': employees,
        'projectManager': projectManager,
        'status': status,
        'dateCreated': dateCreated,
        'invoice': [],
        'purchaseOrder': [],
        'task': [],

      };

      //submit the data to the database via the dataService
      this.dataService.newProject(newProject).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');
        },
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          $("#form-modal").modal("hide");
          this.resetForm();
          this.updateTable();
        }
      );
    }

  }

  //bring in emplopyee
  employeesDisplay(){
    this.dataService.getEmployees()
      .subscribe(
        (res: any) => {

          this.users = res;

        },
        (err) => {
          //Display error in status area
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          //this.formSetup();

        }
      );
  }

  /**
   * Submits the invoice form
   */
  submitFormInvoice(): void {

    $("#form-modal-invoice").modal("hide");

    let proj_id = this.selectedProject._id; // this is used to pass over the project that the invoice is associated with.
    let status = this.invoice.status;
    let description = this.invoice.description;
    let invoiceDate = this.invoice.invoiceDate;
    let totalCost = this.invoice.totalCost;
    let seller = this.invoice.seller;
    //@ts-ignore
    let id = this.invoice._id;

      console.log(this.invoice);
    if (id != null) {
      this.invoice.projectId = proj_id; // this is used to pass over the project that the invoice is associated with.

      this.dataService.editInvoice(this.invoice).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');},
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          this.resetForm();
          $("#form-modal-inv").modal("hide");
          this.updateTable();
        }
      );


    }
    else{

    let newInvoice: Invoice = {
      'projectId' : proj_id,
      'status': status,
      'description' : description,
      'invoiceDate' : invoiceDate,
      'totalCost': totalCost,
      'seller': seller,

    };

    this.dataService.newInvoice(id,newInvoice).subscribe(
      (res: any) => {
        let status = `<strong>${res.status}</strong> - ${res.message}`;
        $("#status").html(status).attr('class', 'alert alert-success');},
      (err: any) => {
        this.resetForm();
        //display error message in status
        let status = `<strong>${err.status}</strong> - ${err.message}`;
        $("#status").html(status).attr('class', 'alert alert-danger');
      },
      () => {
        $("#form-modal-invoice").modal("hide");
        this.resetForm();
        this.updateTable();

      }
    );

    }
  }


  /**
   * Submits the task form
   */
  submitFormTask(): void {

    //console.log ('submit task');

    $("#form-modal-task").modal("hide");

    let proj_id = this.selectedProject._id; // this is used to pass over the project that the invoice is associated with.
    let status = this.task.status;
    let description = this.task.description;
    let taskTime = this.task.time;
    let employee = this.task.employee;
    //@ts-ignore
    let id = this.task._id;

    //console.log(this.task);
    if (id != null) {
      this.invoice.projectId = proj_id; // this is used to pass over the project that the invoice is associated with.

      this.dataService.editTask(this.task).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');},
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          this.resetForm();
          $("#form-modal-task").modal("hide");
          this.updateTable();
        }
      );
    } else{

      let newTask: Task = {
        'projectId' : proj_id,
        'status': status,
        'description' : description,
        'time': taskTime,
        'employee': employee

      };

      this.dataService.newTask(id,newTask).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');},
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          $("#form-modal-task").modal("hide");
          this.resetForm();
          this.updateTable();

        }
      );

    }
  }



  /**
   * Submits the po form
   */

  submitFormPo(): void {

    $("#form-modal").modal("hide");

    let proj_id = this.selectedProject._id; // this is used to pass over the project that the invoice is associated with.
    let status = this.purchaseOrder.status;
    let description = this.purchaseOrder.description;
    let totalCost = this.purchaseOrder.totalCost;
    let buyer = this.purchaseOrder.buyer;
    // @ts-ignore
    let id = this.purchaseOrder._id;

    //console.log(this.purchaseOrder);

    if (id != null) {
      this.purchaseOrder.projectId = proj_id; // this is used to pass over the project that the purchaseOrder is associated with.

      this.dataService.editPurchaseOrder(this.purchaseOrder).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');},
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          this.resetForm();
          $("#form-modal-po").modal("hide");
          this.updateTable();
        }
      );


    }
    else{

      let newPurchaseOrder: PurchaseOrder = {
        'projectId' : proj_id,
        'status': status,
        'description' : description,
        'purchaseOrderDate' : null,
        'totalCost': totalCost,
        'buyer': buyer,

      };

      //console.log('new po')
      //console.log(newPurchaseOrder);

      this.dataService.newPurchaseOrder(id,newPurchaseOrder).subscribe(
        (res: any) => {
          let status = `<strong>${res.status}</strong> - ${res.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');},
        (err: any) => {
          this.resetForm();
          //display error message in status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        },
        () => {
          $("#form-modal-po").modal("hide");
          this.resetForm();
          this.updateTable();
        }
      );

    }
  }

}//end class
