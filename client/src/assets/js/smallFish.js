let DEBUG = true;
let server = "http://localhost:3000";

//open menu
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

//close menu
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

//open menu
function openSidebar() {
    document.getElementById("content").className = "col-10";
    document.getElementById("sidebar").style.display = "block";

}

//close menu
function closeSidebar() {
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("content").className = "col-12";

}


//open Chat
function openChat() {
    document.getElementById("content").className = "col-9";
    document.getElementById("chat").style.display = "block";
}

//close chat
function closeChat() {
    document.getElementById("chat").style.display = "none";
    document.getElementById("content").className = "col-12";
}


//The script below are for admin_employees


//This next is only for the admin_employees.html
//admin_employees scripts (This may need to be moved later on)
$(document).ready(() => {

    //request info and populate table when page loads
    function updateTable() {

        fetch(server + '/api/auth/users')
            .then(res => {
                return res.json()
            })
            .then(data => {

                if (DEBUG) console.log(data);
                let html = tableHtml(data, {'username': 'Username', 'email': 'Email'}, true, true)
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
                console.log(err);
                let status = `<strong>${data.status}</strong> - ${data.message}`;
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
        //TODO look for method to automatically put form data in json format
        let uname = document.getElementById('username').value;
        let pword = document.getElementById('password').value;
        let email = document.getElementById('email').value;
        let name_first = document.getElementById('name_first').value;
        let name_last = document.getElementById('name_last').value;

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
                let status = `<strong>${data.status}</strong> - ${data.message}`;
                $("#status").html(status).attr('class', 'alert alert-danger');
            })


    });

        $("#btn-cancel").click( () => {
            //reset the form data
            $("#user-form")[0].reset();
            $("#form-modal").modal("hide");
        });


});
