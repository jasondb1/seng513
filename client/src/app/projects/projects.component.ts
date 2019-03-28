import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import {TableService} from "../table.service";
import {Project} from "../project";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  project: Project;


  DEBUG: boolean = true;
  server: string = "http://localhost:3000";
  data: any = {};

  //request info and populate table when page loads
  updateTable(): void {

    //get data from server
    fetch(this.server + '/api/auth/project')
      .then(res => {
        return res.json()
      })
      .then(data => {

        //populate data in table
        if (this.DEBUG) console.log(data);
        let html = TableService.tableHtml(data, {'username': 'Username', 'email': 'Email'}, true, true);
        $('#table-employee').html(html);


        //This needs to go here so that the listeners are updated after the table is displayed
        //delete user
        $('a.btn-delete').on('click', event => {

          event.preventDefault();

          //TODO Possibly make a better confirmation dialog
          confirm('Delete This User');

          let id = event.currentTarget.href;
          let regex = /[^/]+$/; //matches everything after the last / to get the id
          id = id.match(regex);

          fetch(this.server + '/api/auth/project/' + id[0], {
            method: 'DELETE',
          })
            .then((res) => res.json())

            //TODO update the table
            .then((data) => {
              let status = `<strong>${data.status}</strong> - ${data.message}`;
              $("#status").html(status).attr('class', 'alert alert-success');

              //update the table if successful
              this.updateTable();
            })
            .catch((err) => {
              let status = `<strong>${data.status}</strong> - ${data.message}`;
              $("#status").html(status).attr('class', 'alert alert-danger');
            })

        });

        //edit user
        //TODO edit user


      })
      .catch(err => {
        //console.log(err);
        let status = `<strong>${err.status}</strong> - ${err.message}`;
        $("#status").html(status).attr('class', 'alert alert-danger');
      });

  }


  //Sets up a new form
  setupForm(): void {

    //Add new user
    $('#submit-user-add').on('click', event => {
      //TODO: add functionality and change action when user is being edited instead of created.
      if (this.DEBUG) {
        console.log("Submit Button Pressed");
      }

      event.preventDefault();

//2 way data-binding


      let desciption = this.project.description;
      let projectManager = this.project.projectManager;

      let newProject ={
        'description' : desciption,
        'projectManager' : projectManager

      };



//post the user data to the server
      fetch(this.server + '/api/auth/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      })
        .then((res) => res.json())
        .then((data) => {
          if (this.DEBUG) console.log(data);
          //close the dialog box and reset the form fields
          $("#form-modal").modal("hide");
          $("#user-form")[0].reset();

          //update status
          let status = `<strong>${data.status}</strong> - ${data.message}`;
          $("#status").html(status).attr('class', 'alert alert-success');

          //update the table
          this.updateTable();
        })
        .catch((err) => {
          if (this.DEBUG) console.log(this.data);
          //close the dialog box and reset the form fields
          $("#form-modal").modal("hide");
          $("#user-form")[0].reset();

          //update status
          let status = `<strong>${err.status}</strong> - ${err.message}`;
          $("#status").html(status).attr('class', 'alert alert-danger');
        })


    });

    $("#btn-cancel").click(() => {
      //reset the form data
      $("#user-form")[0].reset();
      $("#form-modal").modal("hide");
    });
  }

  constructor() {
  }

  ngOnInit() {
    this.project = new Project;

    //update the table
    this.updateTable();
    this.setupForm();


  }

}
