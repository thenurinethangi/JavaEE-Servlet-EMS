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
            $('#imageInput')[0].value = data.image;
            console.log(data.image);

        },
        error: function(xhr){
            console.log("an error ocure when getting selected employee deatils");
            let res = JSON.parse(xhr.responseText);
            clean();
        }

    });

});