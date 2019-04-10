import {Component, OnInit} from '@angular/core';
//import $ from 'jquery';
import {TableService} from "../table.service";
import {Project} from "../project";
import {DataService} from "../data.service";
import {Invoice} from "../invoice";
import {User} from "../user";

declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  private project: Project;
  private selectedProject: Project;
  private projects: Project[];
  private users: [];
  private displayForm: boolean = false;
  stupidArray: Project[];
  private invoice: Invoice;
  DEBUG: boolean = true;
  data: any = {};
  selectedUsers: User[];

  constructor(private dataService: DataService) {
    this.project = <Project>{};
    this.selectedProject = <Project>{};
    this.invoice = <Invoice>{};
  }

  ngOnInit() {
    this.project = new Project;
    this.invoice = new Invoice;
    //update the table
    this.updateTable();
    this.employeesDisplay();
  }



  /////////////////////////
  // resetForm()

  resetForm(): void {
    console.log("Resetting Form");
    this.project = new Project();
    this.invoice = new Invoice();
  }

  /////////////////////////
  // displaySelected()

  displaySelected(index){

    this.selectedProject = this.projects[index];


    //console.log(this.users['_id'].indexOf(this.projects[index].employees));
    this.displayTable2();
    //TODO Enable this when project rooms are ready.
    //this.chatService.changeProject(this.selectedProject.id);
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

    $('#invoice-summary tr').on('mouseover', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      //needed for edit function.
      if (rowId !== null) {
        rowId = rowId.match(regex)[0];
        this.invoice = this.selectedProject.invoice[rowId];
      }

    });

  }

  ///////////////////////////
  // setupDeleteListener()

  setupDeleteListener(): void {

    $('a.btn-delete').on('click', event => {

      event.preventDefault();

      //TODO Possibly make a better confirmation dialog
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
            console.log("[Deletion complete]");
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

    $('#employee-summary a.btn-edit').on('click', event => {
      event.preventDefault();


      $('#form-modal-employee').modal('show');

    });


    $('#invoice-summary a.btn-edit').on('click', event => {
      event.preventDefault();


      $('#form-modal-invoice').modal('show');

    });

    $('#purchase-summary a.btn-edit').on('click', event => {
      event.preventDefault();


      $('#form-modal-PO').modal('show');

    });



  };


  ////////////////
  // displayTable()

  displayTable(): void {
    let html = TableService.tableHtml(this.projects, {'id': 'ID', 'description': 'Description'}, true, true);
    $('#table-summary').html(html);

    console.log(this.projects);
    //setup listeners for the icons on the table
    this.setupDeleteListener();
    this.setupRowListener();
    this.setupEditListener();

  }

  displayTable2(): void {

    let html = TableService.tableHtml(this.selectedProject.invoice, {'status' : 'Status', 'description': 'Description', 'invoiceDate': 'Invoice Date', 'totalCost' : 'totalCost'}, true, true);
    $('#invoice-summary').html(html);

  }



  ////////////////
  // updateTable()

  updateTable(): void {

    console.log("[Get Projects]");
    this.dataService.getProjects()
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
          console.log("Data finished loading.");
          this.displayTable();
          //this.displaySelected();
        }
      );
  }


  ///////////////////////////////////////
  //Submit Form

  submitForm(): void {
    //Add new user

    this.displayForm = false;

    //TODO: add functionality and change action when user is being edited instead of created.
    if (this.DEBUG) {
      console.log("Submit Button Pressed");
    }

    //2 way data-binding
    let description: string = this.project.description;
    let projectManager: string = this.project.projectManager;
    let employees: User[] = this.project.employees;


//todo: update project status etc

    let dateCreated = new Date();

    let newProject: Project ={
      '_id': -1,
      'id': -1,
      '_id': -1,
      'description': description,
      'employees': employees,
      'projectManager': projectManager,
      'status': null,
      'dateCreated': dateCreated,
      'invoice': []

    };

    console.log(newProject);

    //submit the data to the database via the dataService
    this.dataService.newProject(newProject).subscribe(
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
        //$("#form-modal").modal("hide");
        this.resetForm();
        this.updateTable();
      }
    );

  }


  //bring in emplopyee
   employeesDisplay(){
    console.log("[Get Users]");
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
          console.log("Data finished loading.");
          console.log(this.users);
          //this.formSetup();

        }
      );
  }

    // formSetup(){
    //   let html;
    //   for (let i = 0; i < this.users.length; i++) {
    //     html += '<option>';
    //     html += this.users[i]['username'];
    //     html += '</option>';
    //   }
    //
    //
    //   $('#employeeDropDown').html(html);
    //   $('#employeeDropDown2').html(html);
    // }


  submitFormEmployee(): void {
//todo make this work.
  }

  submitFormInvoice(): void {

    let proj_id = this.selectedProject._id; // this is used to pass over the project that the invoice is associated with.
    let status = this.invoice.status
    let description = this.invoice.description;
    let invoiceDate = this.invoice.invoiceDate;
    let totalCost = this.invoice.totalCost;
    let seller = this.invoice.seller;
    let id = this.selectedProject.id;

    let newInvoice: Invoice={
      'projectId' : proj_id,
      'status': null,
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
        //$("#form-modal").modal("hide");
        this.resetForm();
        this.updateTable();
      }
    );
  }


  submitFormPO(): void {
//todo make this work.
  }


}
