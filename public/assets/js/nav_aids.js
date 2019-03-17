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


//admin_employees scripts (This may need to be moved later on)
$(document).ready( () => {

    //request info and populate table when page loads
    employee_data = fetch(server + '/api/auth/users')
            .then(res => {return res.json()})
            .then(data => {

                if (DEBUG) console.log(data);
                let html = tableHtml(data, ['username', 'email'], true, true)
                console.log(html);

            })
            .catch(err => {
                console.log(err);
                //TODO: diplay error on status message
            });

    //add user
    $('#submit-user-add').on('click', () => {
        //TODO: add functionality and change action when user is being edited instead of created.

        if (DEBUG) {
            console.log("Submit Button Pressed");
        }

        let form = document.getElementById('user-form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', server + "/api/auth/useradd");
        form.submit();
    });



//TODO: add cancel button handling

})