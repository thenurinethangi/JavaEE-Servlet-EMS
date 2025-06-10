let signUpBtn = $('#signUpBtn');
signUpBtn.on('click',()=>{
    
    let userName = $('#userNameInput')[0].value.trim();
    let fullName = $('#nameInput')[0].value.trim();
    let email = $('#emailInput')[0].value.trim();
    let password = $('#passwordInput')[0].value.trim();

    if(userName==='' || fullName==='' || email==='' || password===''){
        Swal.fire({
            title: 'Error!',
            text: 'All fields required',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    const usernameRegex = /^[a-zA-Z0-9_@]{3,16}$/;
    const fullNameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^[A-Za-z\d@$!%*?#&]{6,}$/;

    let userNameValidation = usernameRegex.test(userName);
    let nameValidation = fullNameRegex.test(fullName);
    let emailValidation = emailRegex.test(email);
    let passwordValidation = passwordRegex.test(password);

    if(!userNameValidation || !nameValidation || !emailValidation || !passwordValidation){
        Swal.fire({
            title: 'Error!',
            text: 'Invalid input',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let data = {
        "userName": userName,
        "fullName": fullName,
        "email": email,
        "password": password
    };

    $.ajax({
        url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/signup',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res){
            let code = res.code;
            let status = res.status;
            let message = res.message;

            clean();
            if(code=='200'){
                window.location.href = '../../sign-in.html';
            }
        },
        error: function(xhr){

            let res = xhr.responseText;
            res = JSON.parse(res);
            let code = res.code;
            let status = res.status;
            let message = res.message;

            if(code=='400'){
                Swal.fire({
                    title: 'Error!',
                    text: 'User Name Already Exist, Try Another User Name Or Sign In',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else if(code=='500'){
                clean();
                Swal.fire({
                    title: 'Error!',
                    text: 'Sign-up Unsuccessful. Please Try Again Later',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    });
    
});


function clean(){

    $('#userNameInput')[0].value = '';
    $('#nameInput')[0].value = '';
    $('#emailInput')[0].value = '';
    $('#passwordInput')[0].value = '';
}