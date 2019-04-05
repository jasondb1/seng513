import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import {TableService} from "../table.service";
import {Project} from "../project";
import {DataService} from "../data.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  private project: Project;
  private selectedProject: Project;
  private projects: Project[];
  private displayForm: boolean = false;

  DEBUG: boolean = true;
  server: string = "http://localhost:3000";
  data: any = {};

  constructor(private dataService: DataService) {
    this.project = <Project>{};
    this.selectedProject = <Project>{};
  }

  ngOnInit() {
    this.project = new Project;

    //update the table
    this.updateTable();
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
    console.log("display selected:");
    console.log(this.projects);
    console.log(this.projects[index]);
    this.selectedProject = this.projects[index];

    //TODO Enable this when project rooms are ready.
    //this.chatService.changeProject(this.selectedProject.id);
  }

  ///////////////////////////
  // setupRowListener()

  setupRowListener(): void {

    $('#table-summary tr').on('click', event => {

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

      console.log("[Edit Form] button clicked");

      this.project = this.selectedProject;
      this.displayForm = true;
      this.displayForm = true;

      console.log(this.project);
      console.log(this.displayForm);
    })
  };


  ////////////////
  // displayTable()

  displayTable(): void {
    let html = TableService.tableHtml(this.projects, {'id': 'ID', 'description': 'Description'}, true, true);
    $('#table-summary').html(html);

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
          console.log(res);
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
          this.displaySelected(0);
        }
      );
  }
  //
  // //Sets up a new form
  // setupForm(): void {
  //
  //   //Add new project
  //   $('#submit-project-add').on('click', event => {
  //     //TODO: add functionality and change action when project is being edited instead of created.
  //     if (this.DEBUG) {
  //       console.log("Submit Button Pressed");
  //     }
  //
  //     event.preventDefault();
  //
  //   //2 way data-binding
  //     let desciption = this.project.description;
  //     let projectManager = this.project.projectManager;
  //
  //     let newProject ={
  //       'description' : desciption,
  //       'projectManager' : projectManager
  //
  //     };
  //
  //   //post the project data to the server
  //     fetch(this.server + '/api/project', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(newProject)
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (this.DEBUG) console.log(data);
  //         //close the dialog box and reset the form fields
  //         $("#form-modal").modal("hide");
  //         $("#project-form")[0].reset();
  //
  //         //update status
  //         let status = `<strong>${data.status}</strong> - ${data.message}`;
  //         $("#status").html(status).attr('class', 'alert alert-success');
  //
  //         //update the table
  //         this.updateTable();
  //       })
  //       .catch((err) => {
  //         if (this.DEBUG) console.log(this.data);
  //         //close the dialog box and reset the form fields
  //         $("#form-modal").modal("hide");
  //         $("#project-form")[0].reset();
  //
  //         //update status
  //         let status = `<strong>${err.status}</strong> - ${err.message}`;
  //         $("#status").html(status).attr('class', 'alert alert-danger');
  //       })
  //   });
  //
  //   $("#btn-cancel").click(() => {
  //     //reset the form data
  //     $("#project-form")[0].reset();
  //     $("#form-modal").modal("hide");
  //   });
  // }

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
      'employees': "",
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



}
