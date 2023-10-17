

$(document).ready(function() {
    // updating current 'active' navbar link
    var currentPageRoute = (window.location.pathname.split("/")[1]);
    $('.navbar li.active').removeClass('active');
    $('#navbar_' + currentPageRoute).addClass('active');
});

