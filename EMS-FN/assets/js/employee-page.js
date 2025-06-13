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

function loadTable(params) {
    
    $.ajax({
        url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee',
        method: 'GET',
        success: function(res){
            let data = res.data;

            let tbody = $('#tbody');
            tbody.empty();

            for (const x of data) {
                let id = x.id;
                let name = x.name;
                let address = x.address;
                let phoneNo = x.phoneNo;
                let salary = x.salary;

                let row = `
                            <tr>
                            <td>${id}</td>
                            <td>${name}</td>
                            <td>${address}</td>
                            <td>${phoneNo}</td>
                            <td>${salary}</td>
                        </tr>
                `;

                tbody.append(row);
            }

        },
        error: function(){
            console.log("an error ocure while laoding employee table");
        }

    });
}
loadTable();

function generateNewid(params) {
    
    $.ajax({
        url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee?newid=true',
        method: 'GET',
        success: function(res){
            let data = res.data;
            let idInputField = $('#idInput')[0];
            idInputField.value = data;
        },
        error: function(){
            Swal.fire({
                title: 'Error!',
                text: 'Failed To Generate New Employee ID',
                icon: 'error',
                showConfirmButton: false,
                timer: 700  
            });
            console.log("an error ocure while generating a new employee id");
        }

    });
}
generateNewid();


function clean(){

    $('#nameInput')[0].value = '';
    $('#addressInput')[0].value = '';
    $('#phoneNoInput')[0].value = '';
    $('#salaryInput')[0].value = '';
    $('#imageInput')[0].value = '';

    $('#searchBarField')[0].value = '';

    loadTable();
    generateNewid();
}


let cleanBtn = $('#clearBtn');
cleanBtn.on('click',()=>{
    clean();
});


let searchBar = $('#searchBarField')[0];
searchBar.addEventListener('keyup',function(event){

    let input = this.value;

    if((input===1 && event.key == 'Backspace') || (input>0 && event.key == 'Delete')){
        clean();
    }

    if (event.key !== 'Enter') {
        return;
    }

    input = input.toLowerCase();
    input = input.trim();
    const regex = /^[Ee]-\d{4}$/;
    let bool = regex.test(input);

    if(!bool){
        clean();
        return;
    }

    $.ajax({
        url: `http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee/${input}`,
        method: 'GET',
        success: function(res){
            let data = res.data;

            $('#idInput')[0].value = data.id;
            $('#nameInput')[0].value = data.name;
            $('#addressInput')[0].value = data.address;
            $('#phoneNoInput')[0].value = data.phoneNo;
            $('#salaryInput')[0].value = data.salary;
            $('#imageInput')[0].value = '';

        },
        error: function(xhr){
            console.log("an error ocure when getting selected employee deatils");
            let res = JSON.parse(xhr.responseText);
            clean();
        }

    });

});


let deleteBtn = $('#deleteBtn');
deleteBtn.on('click',()=>{
    
    let id = $('#idInput')[0].value;
    
    $.ajax({
        url: `http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee/${id}`,
        method: 'DELETE',
        success: function(){
            clean();
            Swal.fire({
                    title: 'Success!',
                    text: 'Successfully Deleted Employee ID: '+id,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
        },
        error: function(){
            clean();
        }

    });
});



let saveBtn = $('#saveBtn');
saveBtn.on('click',()=>{

    let id = $('#idInput')[0].value;
    let name = $('#nameInput')[0].value;
    let address = $('#addressInput')[0].value;
    let phoneNo = $('#phoneNoInput')[0].value;
    let salary = $('#salaryInput')[0].value;
    let image = $('#imageInput')[0].files[0];

    if(id==='' || name==='' || address==='' || phoneNo==='' || salary===''){
        Swal.fire({
            title: 'Error!',
            text: 'All fields required',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;

    }

    const idRegex = /^E-\d{4}$/;
    const nameRegex = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    const addressRegex = /^[\dA-Za-z\s,\/\-]+$/;
    const phoneRegex = /^(?:0\d{9}|\+94\d{9})$/;
    const salaryRegex = /^\d+(?:\.\d{1,2})?$/;

    let idValidation = idRegex.test(id);
    let namevalidation = nameRegex.test(name);
    let addressvalidation = addressRegex.test(address);
    let phoneNoValidation = phoneRegex.test(phoneNo);
    let salaryValidation = salaryRegex.test(salary);

    if(!idValidation || !namevalidation || !addressvalidation || !phoneNoValidation || !salaryValidation){
        Swal.fire({
            title: 'Error!',
            text: 'Invalid input',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('phoneNo', phoneNo);
    formData.append('salary', salary);
    formData.append('image', image);

    $.ajax({
        url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee',
        method: 'POST',
        data: formData,
        contentType: false, 
        processData: false, 
        success: function (res) {
            clean();
            Swal.fire({
                    title: 'Success!',
                    text: 'Successfully Added New Employee',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            console.log('added');
            console.log(res);
        },
        error: function(xhr){
            clean();
            Swal.fire({
                    title: 'Error!',
                    text: 'Failed To Added New Employee. Please Try Again Later',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            console.log("an error ocure when adding a new employee");
            console.log(xhr.responseText);
        }
    });
}); 




let updateBtn = $('#updateBtn');
updateBtn.on('click',()=>{

    console.log("update fuction");

    // let id = $('#idInput')[0].value;
    // let name = $('#nameInput')[0].value;
    // let address = $('#addressInput')[0].value;
    // let phoneNo = $('#phoneNoInput')[0].value;
    // let salary = $('#salaryInput')[0].value;
    // let image = $('#imageInput')[0].files[0];

    // if(id==='' || name==='' || address==='' || phoneNo==='' || salary===''){
    //     Swal.fire({
    //         title: 'Error!',
    //         text: 'All fields required',
    //         icon: 'error',
    //         confirmButtonText: 'Ok'
    //     });
    //     return;

    // }

    // const idRegex = /^E-\d{4}$/;
    // const nameRegex = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    // const addressRegex = /^[\dA-Za-z\s,\/\-]+$/;
    // const phoneRegex = /^(?:0\d{9}|\+94\d{9})$/;
    // const salaryRegex = /^\d+(?:\.\d{1,2})?$/;

    // let idValidation = idRegex.test(id);
    // let namevalidation = nameRegex.test(name);
    // let addressvalidation = addressRegex.test(address);
    // let phoneNoValidation = phoneRegex.test(phoneNo);
    // let salaryValidation = salaryRegex.test(salary);

    // if(!idValidation || !namevalidation || !addressvalidation || !phoneNoValidation || !salaryValidation){
    //     Swal.fire({
    //         title: 'Error!',
    //         text: 'Invalid input',
    //         icon: 'error',
    //         confirmButtonText: 'Ok'
    //     });
    //     return;
    // }

    // let formData = new FormData();
    // formData.append('id', id);
    // formData.append('name', name);
    // formData.append('address', address);
    // formData.append('phoneNo', phoneNo);
    // formData.append('salary', salary);
    // formData.append('image', image);

    // $.ajax({
    //     url: 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee',
    //     method: 'POST',
    //     data: formData,
    //     contentType: false, 
    //     processData: false, 
    //     success: function (res) {
    //         clean();
    //         Swal.fire({
    //                 title: 'Success!',
    //                 text: 'Successfully Added New Employee',
    //                 icon: 'success',
    //                 confirmButtonText: 'Ok'
    //             });
    //         console.log('added');
    //         console.log(res);
    //     },
    //     error: function(xhr){
    //         clean();
    //         Swal.fire({
    //                 title: 'Error!',
    //                 text: 'Failed To Added New Employee. Please Try Again Later',
    //                 icon: 'error',
    //                 confirmButtonText: 'Ok'
    //             });
    //         console.log("an error ocure when adding a new employee");
    //         console.log(xhr.responseText);
    //     }
    // });
}); 



let viewBtn = $('#viewBtn');
viewBtn.on('click',()=>{
   
    let id = $('#idInput')[0].value;
    let name = $('#nameInput')[0].value;

    if(name===''){
        return;
    }

    $.ajax({
        url: `http://localhost:8080/Employee_Management_System_Backend_Web_exploded/employee/${id}`,
        method: 'GET',
        success: function(res){

            let data = res.data;

            $('#em-id')[0].value = data.id;
            $('#em-name')[0].value = data.name;
            $('#em-address')[0].value = data.address;
            $('#em-phoneNo')[0].value = data.phoneNo;
            $('#em-salary')[0].value = data.salary;

            let imagePath = data.image;
            let img = $('#em-image')[0];
            img.src = 'http://localhost:8080/Employee_Management_System_Backend_Web_exploded/'+imagePath;

            console.log('view');
            console.log(res);
        },
        error: function(xhr){
            console.log('an error ocure while view a employee deatil');
            console.log(xhr.responseText);
        }

    });
    
});



let logOutBtn = $('#logOutBtn');
logOutBtn.on('click',()=>{

    localStorage.removeItem("userName");
    window.location.href = '../../sign-in.html';
});