$(document).ready(function() {
    var currentPageRoute = (window.location.pathname.split("/")[1]);
    $('.navbar li.active').removeClass('active');
    $('#navbar_' + currentPageRoute).addClass('active');
});