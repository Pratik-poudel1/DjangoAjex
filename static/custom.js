let currentUpdateId = null; // track if we are updating

function addstudent(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let address = document.getElementById("address").value.trim();

    if (!name || !email || !address) {
        Swal.fire({ title: "Error!", text: "All fields are required", icon: "error" });
        return;
    }

    let sendData = new FormData();
    sendData.set("name", name);
    sendData.set("email", email);
    sendData.set("address", address);

    if (currentUpdateId) {
        // Update existing student
        axios.post('update/' + currentUpdateId + '/', sendData)
            .then(response => {
                Swal.fire({ title: 'Updated!', text: 'Data updated successfully', icon: 'success' });
                getAllData();
                resetForm();
            })
            .catch(error => console.error("Error updating:", error));
    } else {
        // Add new student
        axios.post('insert/', sendData)
            .then(response => {
                Swal.fire({ title: 'Success!', text: 'Data added successfully', icon: 'success' });
                getAllData();
                resetForm();
            })
            .catch(error => console.error("Error adding:", error));
    }
}

function resetForm() {
    let form = document.getElementById("studentForm");
    if (form) {
        form.reset();
        console.log("Form reset successfully");
    } else {
        console.error("Form element not found");
    }
    let submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.innerText = "Submit";
    }
    currentUpdateId = null;
}

function getAllData() {
    axios.get('all/')
        .then(function (response) {
            let outPut = '';
            response.data.forEach(function (student, index) {
                outPut += `<tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.address}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                        <button class="btn btn-primary" onclick="updateStudent(${student.id})">Update</button>
                    </td>
                </tr>`;
            });
            document.getElementById("studentTableBody").innerHTML = outPut;
        })
        .catch(function (error) {
            console.error("Error fetching data!", error);
        });
}

getAllData();

function deleteStudent(id) {
    axios.get('delete/' + id + '/')
        .then(function (response) {
            Swal.fire({ title: 'Deleted!', text: 'Data deleted successfully', icon: 'success' });
            getAllData();
            if (currentUpdateId === id) resetForm();
        })
        .catch(function (error) { console.error(error); });
}

function updateStudent(id) {
    axios.get('get/' + id + '/')
        .then(function(response) {
            let student = response.data;
            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("address").value = student.address;

            currentUpdateId = id;
            let submitBtn = document.getElementById("submitBtn");
            if (submitBtn) submitBtn.innerText = "Update";
        })
        .catch(err => console.error(err));
        resetForm();
}
