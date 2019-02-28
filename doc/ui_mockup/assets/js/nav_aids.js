//open menu
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

//close menu
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

function openChat() {
    document.getElementById("content").className = "col-9";
    //document.getElementById("chat").style.visibility = "visible";
    //document.getElementById("chat").style.display = "block";
    document.getElementById("chat").style.width = "100%";
}

//close chat
function closeChat() {
    //document.getElementById("chat").style.visibility = "hidden";
    document.getElementById("content").className = "col-12";
    //document.getElementById("chat").style.display = "none";
    document.getElementById("chat").style.width = "0";
}
