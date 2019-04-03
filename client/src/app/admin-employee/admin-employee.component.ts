import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import {TableService} from "../table.service";
import {User} from "../user";
import {DataService} from "../data.service";
//import {Observable} from 'rxjs';

@Component({
  selector: 'app-admin-employee',
  templateUrl: './admin-employee.component.html',
  styleUrls: ['./admin-employee.component.css']
})
export class AdminEmployeeComponent implements OnInit {


  DEBUG: boolean = true;

  private user: User;
  private selectedUser: User;
  private users = [];
  private displayForm: boolean = false;


  constructor(private dataService: DataService) {
    this.user = <User>{};
    this.selectedUser = <User>{};
  }

  /////////////////////////
  // ngOnInit()

  ngOnInit() {

    this.user = new User;
    this.selectedUser = new User;
    this.updateTable();  //Testing

  }

  ////////////////
  // displayTable()

  displayTable(): void {
    let html = TableService.tableHtml(this.users, {'username': 'Username', 'email': 'Email'}, true, true);
    $('#table-summary').html(html);

    //setup listeners for the icons on the table
    this.setupDeleteListener();
    this.setupRowListener();
    this.setupEditListener();

  }

  ////////////////
  // updateTable()

  updateTable(): void {

    console.log("[Get Users]");
    this.dataService.getEmployees()
      .subscribe(
        (res: any[]) => {
          console.log(res);
          this.users = res;
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

  ///////////////////////////
  // setupDeleteListener()

  setupDeleteListener(): void {

    $('a.btn-delete').on('click', event => {

      event.preventDefault();

      //TODO Possibly make a better confirmation dialog
      let isConfirmed = confirm('Delete This User');

      if (isConfirmed) {
        let id = event.currentTarget.href;
        let regex = /[^/]+$/; //matches everything after the last / to get the id
        id = id.match(regex);

        this.dataService.deleteEmployee(id[0]).subscribe((res: any) => {

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

      this.user = this.selectedUser;
      this.displayForm = true;
      this.openForm();

      console.log(this.user);
      console.log(this.displayForm);

      // let id = event.currentTarget.href;
      // let regex = /[^/]+$/; //matches everything after the last / to get the id
      // id = id.match(regex)[0];

    })
  };

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

  ///////////////////////////////////////
  //Submit Form

  submitForm(): void {
    //Add new user

      this.displayForm = false;

      //TODO: add functionality and change action when user is being edited instead of created.
      if (this.DEBUG) {
        console.log("Submit Button Pressed");
      }

      //event.preventDefault();

      //2 way data-binding
      let uname = this.user.username;
      let pword = this.user.password;
      let email = this.user.email;
      let name_first = this.user.name_first;
      let name_last = this.user.name_last;
      let admin = this.user.admin;

      //compose the new user from the form fields
      let newUser: User = {
        'username': uname,
        'password': pword,
        'email': email,
        'name_first': name_first,
        'name_last': name_last,
        'admin': admin
      };

      //submit the data to the database via the dataService
      this.dataService.newEmployee(newUser).subscribe(
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

  /////////////////////////
  // resetForm()

  resetForm(): void {
    console.log("Resetting Form");
    this.user = new User();
  }

  openForm(): void {
    this.displayForm = true;
  }

  /////////////////////////
  // displaySelected()

  displaySelected(index){
    console.log("display selected:");
    console.log(this.users);
    console.log(this.users[index]);
    this.selectedUser = this.users[index];

  }


}
