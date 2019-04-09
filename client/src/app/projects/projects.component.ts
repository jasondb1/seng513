import {Component, OnInit} from '@angular/core';
//import $ from 'jquery';
import {TableService} from "../table.service";
import {Project} from "../project";
import {DataService} from "../data.service";
import {Invoice} from "../invoice";

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

    $('#table-summary tr').on('click', event => {

      let rowId = event.currentTarget.id;
      let regex = /[^R]+$/; //matches everything after the last / to get the id

      console.log(regex);

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

    $('a.btn-edit').on('click', event => {
      event.preventDefault();

      this.project = this.selectedProject;
      this.displayForm = true;


      $('#form-modal').modal('show');

    })
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


    //setup listeners for the icons on the table
    this.setupDeleteListener();
    this.setupRowListener();
    this.setupEditListener();

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



    let newProject: Project ={
      'id': -1,
      'description': description,
      'employees': null,
      'projectManager': projectManager
    };

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
          this.formSetup();

        }
      );
  }

    formSetup(){
      let html;
      for (let i = 0; i < this.users.length; i++) {
        html += '<option>';
        html += this.users[i]['username'];
        html += '</option>';
      }


      $('#employeeDropDown').html(html);
      $('#employeeDropDown2').html(html);
    }


  submitFormEmployee(): void {
//todo make this work.
  }

  submitFormInvoice(): void {

    let description = this.invoice.description;
   //let projectId = this.selectedProject._id;
    let id = this.selectedProject._id;
    let newInvoice: Invoice={
      'projectId' : id,
      'description' : "duck",
      'invoiceDate' : null,
      'dateCreated':  null,
      'status': null,
      'totalCost': null
    };



    console.log(id);
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
