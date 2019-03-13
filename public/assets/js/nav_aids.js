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
