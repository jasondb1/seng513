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
    document.getElementById("chat").style.visibility = "visible";
}

//close chat
function closeChat() {
    document.getElementById("chat").style.visibility = "hidden";
    document.getElementById("content").className = "col-12";
}
