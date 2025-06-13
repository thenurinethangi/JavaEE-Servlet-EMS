$(document).ready(function() {
    var username = localStorage.getItem('userName');
    if (!username) {
        window.location.href = '../../sign-in.html';
    }else {
        //
    }
});


$(document).ready(function() {
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });
});