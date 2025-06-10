let signInBtn = $('#signInBtn');
signInBtn.on('click',()=>{
    
    let userName = $('#userNameInput')[0].value.trim();
    let password = $('#passwordInput')[0].value.trim();

    if(userName==='' || password===''){
        Swal.fire({
            title: 'Error!',
            text: 'Please Provide All Require Data To Sign In',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let data = {
        "userName": userName,
        "password": password
    };

    $.ajax({
        url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/signin',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res){
            let code = res.code;
            let status = res.status;
            let message = res.message;

            clean();
            if(code=='200'){
                localStorage.setItem("userName",userName);
                window.location.href = '../../dashboard.html';
            }
        },
        error: function(xhr){

            let res = xhr.responseText;
            res = JSON.parse(res);
            let code = res.code;
            let status = res.status;
            let message = res.message;

            if(code=='400' && message=='password incorrect!'){
                Swal.fire({
                    title: 'Error!',
                    text: 'Password Incorrect',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else if(code=='400' && message=='user not exist!'){
                clean();
                Swal.fire({
                    title: 'Error!',
                    text: 'User Not Exist, Please Sign Up',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else if(code=='500'){
                clean();
                Swal.fire({
                    title: 'Error!',
                    text: 'Sign-In Unsuccessful. Please Try Again Later',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    });
    
});


function clean(){

    $('#userNameInput')[0].value = '';
    $('#passwordInput')[0].value = '';
}