let uploadedFileText = "";

const localVaultFileKey = "localVault_284098x980930x902348x802346_DO_NOT_CHANGE_THIS_LINE";

function encoderAccess() { 
    document.getElementById("encoderMenuContainer").style.display = "none";
    document.getElementById("encoderBgImage").style.display = "none"; 
    document.body.style.overflow = "unset";
    document.getElementById("encoderPasswordsPage").style.display = "flex";
}

async function saveEncodedPasswords() {
    const tableBody = document.getElementById("passwordTableBody");
    const rows = tableBody.querySelectorAll("tr");

    let fileContent = localVaultFileKey.toString() + "\n"; // Adding the key as the first line

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const websiteName = cells[0].textContent;
        const websiteLink = cells[1].textContent;
        const username = cells[2].textContent;
        const password = cells[3].textContent;

        fileContent +=
            websiteName + "," + websiteLink + "," + username + "," + password + "\n";
    }

    // Encrypt the file content using a secret passphrase
    const passphrase = "YourSecretPassphrase";
    const encryptedContent = CryptoJS.AES.encrypt(fileContent, passphrase).toString();

    const filename = "passwords.lclv";
    const blob = new Blob([encryptedContent], { type: "text/plain" });

    // Create a temporary <a> element to trigger the download
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = URL.createObjectURL(blob);

    anchor.target = "_blank"; // Optional: Open the download link in a new tab or window
    anchor.click();

    // Clean up
    URL.revokeObjectURL(anchor.href);
    Swal.fire('Saved!', 'Your passwords have been saved.', 'success');
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Password copied to clipboard");
}

async function loadPasswords() {
    const response = await fetch('http://localhost:3000/passwords');
    const passwords = await response.json();
    const passwordTableBody = document.getElementById('passwordTableBody');

    passwordTableBody.innerHTML = '';
    passwords.forEach(password => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-id="${password._id}">${password.websiteName}</td>
            <td><a href="${password.websiteLink}" target="_blank">${password.websiteLink}</a></td>
            <td>${password.username}</td>
            <td>${password.password}</td>
            <td class="edit-col" onclick="editPasswordSet(this.parentNode)">Edit</td>
            <td class="delete-col" onclick="deletePassword('${password._id}')">Delete</td>
        `;
        passwordTableBody.appendChild(row);
    });
}

async function deletePassword(id) {
    await fetch(`http://localhost:3000/passwords/${id}`, {
        method: 'DELETE'
    });
    loadPasswords();
    Swal.fire('Deleted!', 'Your password has been deleted.', 'success');
}

document.getElementById("passwordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("passwordFormSubmitButton").value = "ADD";
    document.getElementById("passwordFormCancelButton").style.display = "none";

    // Remove highlighted row class from each element that has it on it
    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });

    // Retrieve form input values
    const websiteName = document.getElementById("websiteName").value;
    const websiteLink = document.getElementById("websiteLink").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (editRow) {
        const cells = editRow.cells;
        const id = cells[0].dataset.id;

        await fetch(`http://localhost:3000/passwords/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ websiteName, websiteLink, username, password })
        });

        editRow = null;
        Swal.fire('Updated!', 'Your password has been updated.', 'success');
    } else {
        await fetch('http://localhost:3000/passwords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ websiteName, websiteLink, username, password })
        });
        Swal.fire('Added!', 'Your password has been added.', 'success');
    }

    loadPasswords();

    // Reset the form input fields
    document.getElementById("websiteName").value = "";
    document.getElementById("websiteLink").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
});

function encoderPromptFile() {
    let fileUpload = document.createElement("input");
    fileUpload.type = "file";
    fileUpload.accept = ".lclv";
    fileUpload.style.display = "none";

    fileUpload.addEventListener("change", function () {
        let file = fileUpload.files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
            let encryptedText = reader.result;

            // Decrypt the file content using the secret passphrase
            const passphrase = "YourSecretPassphrase";
            const decryptedContent = CryptoJS.AES.decrypt(encryptedText, passphrase).toString(CryptoJS.enc.Utf8);

            let firstLine = decryptedContent.trim().split("\n")[0]; // Extract the first line of the text
            if (firstLine.toString().replace(/\s/g, "") === localVaultFileKey.toString()) {
                console.log("FIRST LINE MATCHES LOCALVAULT KEY");

                // Remove existing rows from the table
                const tableBody = document.getElementById("passwordTableBody");
                tableBody.innerHTML = "";

                // Split the text content by newline character
                const rows = decryptedContent.trim().split("\n");

                // Loop through the rows starting from the second row (index 1)
                for (let i = 1; i < rows.length; i++) {
                    const rowValues = rows[i].split(",");
                    const websiteName = rowValues[0];
                    const websiteLink = rowValues[1];
                    const username = rowValues[2];
                    const password = rowValues[3];

                    // Create a new row in the table with the extracted values
                    const newRow = tableBody.insertRow();

                    const cell1 = newRow.insertCell();
                    cell1.textContent = websiteName;
                    cell1.classList.add("websiteName-cell");

                    const cell2 = newRow.insertCell();
                    cell2.innerHTML = websiteLink !== "" ? `<a href="${websiteLink}" target="_blank">${websiteLink}</a>` : "";
                    cell2.classList.add("websiteLink-cell");

                    const cell3 = newRow.insertCell();
                    cell3.textContent = username;
                    cell3.classList.add("username-cell");

                    const cell4 = newRow.insertCell();
                    cell4.textContent = password;
                    cell4.classList.add("password-cell"); // Add the custom class to the password cell
                    cell4.addEventListener("click", function() {
                        copyToClipboard(password);
                    });

                    const cell5 = newRow.insertCell();
                    const editBtn = document.createElement("span");
                    editBtn.className = "edit-btn";
                    editBtn.textContent = "Edit";
                    editBtn.addEventListener("click", function () {
                        editPasswordSet(newRow);
                    });
                    cell5.appendChild(editBtn);

                    const cell6 = newRow.insertCell();
                    const deleteBtn = document.createElement("span");
                    deleteBtn.className = "delete-btn";
                    deleteBtn.textContent = "Delete";
                    deleteBtn.addEventListener("click", function () {
                        deletePasswordSet(newRow);
                    });
                    cell6.appendChild(deleteBtn);
                }

                // Show the accessed passwords page
                encoderAccess();
                uploadedFileText = decryptedContent;
            }
        };
        reader.readAsText(file);
    });

    document.body.appendChild(fileUpload);
    fileUpload.click();
    document.body.removeChild(fileUpload);
}

let editRow = null;

function editPasswordSet(row) {
    const tableRow = row;
    const cells = tableRow.cells;

    const websiteName = cells[0].textContent;
    const websiteLink = cells[1].textContent;
    const username = cells[2].textContent;
    const password = cells[3].textContent;

    window.scrollTo(0, document.body.scrollHeight);

    // Set the blank placeholder values to whatever the value in the row values are
    document.getElementById("websiteName").value = websiteName;
    document.getElementById("websiteLink").value = websiteLink;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;

    document.getElementById("passwordFormSubmitButton").value = "CHANGE?";

    // Remove highlighted row class from each element that has it on it in case edited row is changed midway
    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });
    // Add the highlighted-row class to the edited row
    tableRow.classList.add('highlighted-row');

    document.getElementById("passwordFormCancelButton").style.display = "inline";

    editRow = tableRow;
}

function editPasswordCancel() {
    document.getElementById("passwordFormCancelButton").style.display = "none";

    // Reset the form input fields
    document.getElementById("websiteName").value = "";
    document.getElementById("websiteLink").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // Remove highlighted row class from each element that has it on it
    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });

    editRow = null;

    document.getElementById("passwordFormSubmitButton").value = "ADD";
}

// Load passwords on page load
document.addEventListener('DOMContentLoaded', loadPasswords);
