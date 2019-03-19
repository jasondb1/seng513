import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
//import tableHtml from 'table';
//import { tableHtml } from '../../assets/js/table.js';\
import {TableService} from "../table.service";
import {User} from "../user";


@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.css']
})
export class WorkareaComponent implements OnInit {

  constructor(private tableService: TableService) { }

  ngOnInit() {

    let user:User;

    let DEBUG = true;
    let server = "http://localhost:3000";
    let data = {};

      //request info and populate table when page loads
      function updateTable() {

        //get data from server
        fetch(server + '/api/auth/users')
          .then(res => {
            return res.json()
          })
          .then(data => {

            //populate data in table
            if (DEBUG) console.log(data);
            let html = this.tablesService.tableHtml(data, {'username': 'Username', 'email': 'Email'}, true, true);
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

              fetch(server + '/api/auth/users/' + id[0], {
                method: 'DELETE',
              })
                .then((res) => res.json())

                //TODO update the table
                .then((data) => {
                  let status = `<strong>${data.status}</strong> - ${data.message}`;
                  $("#status").html(status).attr('class', 'alert alert-success');

                  //update the table
                  updateTable();
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

      //update the table
      updateTable();


      //Add new user
      $('#submit-user-add').on('click', event => {
        //TODO: add functionality and change action when user is being edited instead of created.
        if (DEBUG) {
          console.log("Submit Button Pressed");
        }

        event.preventDefault();

        //all of the fields
        // //TODO look for method to automatically put form data in json format
        // let element = document.getElementById('username') as HTMLInputElement;
        // let uname = element.value;
        // element = document.getElementById('password') as HTMLInputElement;
        // let pword = element.value;
        // element = document.getElementById('email') as HTMLInputElement;
        // let email = element.value;
        // element = document.getElementById('name_first') as HTMLInputElement;
        // let name_first = element.value;
        // element = document.getElementById('name_last') as HTMLInputElement;
        // let name_last = element.value;

        let uname = user.username;
        let pword = user.password;
        let email = user.email;
        let name_first = user.name_first;
        let name_last = user.name_last;
        let admin = user.admin;

        //let uname = <HTMLInputElement>document.getElementById('username') as HTMLInputElement;
        //let pword = <HTMLInputElement>document.getElementById('password').value;
        // let email = <HTMLInputElement>document.getElementById('email').value;
        // let name_first = <HTMLInputElement>document.getElementById('name_first').value;
        // let name_last = (<HTMLInputElement>document.getElementById('name_last').value);



        let newUser = {
          'username': uname,
          'password': pword,
          'email': email,
          'name_first': name_first,
          'name_last': name_last,
        };

        //post the user data to the server
        fetch(server + '/api/auth/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })
          .then((res) => res.json())
          .then((data) => {
            if (DEBUG) console.log(data);
            //close the dialog box and reset the form fields
            $("#form-modal").modal("hide");
            $("#user-form")[0].reset();

            //update status
            let status = `<strong>${data.status}</strong> - ${data.message}`;
            $("#status").html(status).attr('class', 'alert alert-success');

            //update the table
            updateTable();
          })
          .catch((err) => {
            if (DEBUG) console.log(data);
            //close the dialog box and reset the form fields
            $("#form-modal").modal("hide");
            $("#user-form")[0].reset();

            //update status
            let status = `<strong>${err.status}</strong> - ${err.message}`;
            $("#status").html(status).attr('class', 'alert alert-danger');
          })


      });

      $("#btn-cancel").click( () => {
        //reset the form data
        $("#user-form")[0].reset();
        $("#form-modal").modal("hide");
      });



  }

}
