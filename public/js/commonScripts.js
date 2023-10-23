

$(document).ready(function() {
    // updating current 'active' navbar link
    var currentPageRoute = (window.location.pathname.split("/")[1]);
    $('.navbar li.active').removeClass('active');
    $('#navbar_' + currentPageRoute).addClass('active');
});

// disabling form submission if there are invalid fields
(function () {
'use strict'

// fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.validated-form')

// loop over them and prevent submission
Array.prototype.slice.call(forms)
    .forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
    })
})()
