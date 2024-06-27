
let uploadedFileText = "";

const localVaultFileKey = "localVault_284098x980930x902348x802346_DO_NOT_CHANGE_THIS_LINE";

function encoderAccess() {
    document.getElementById("encoderMenuContainer").style.display = "none";
    document.getElementById("encoderBgImage").style.display = "none";
    document.body.style.overflow = "unset";
    document.getElementById("encoderPasswordsPage").style.display = "flex";
}

function saveEncodedPasswords() {
    const tableBody = document.getElementById("passwordTableBody");
    const rows = tableBody.querySelectorAll("tr");

    let fileContent = localVaultFileKey.toString() + "\n";
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const websiteName = cells[0].textContent;
        const websiteLink = cells[1].textContent;
        const username = cells[2].textContent;
        const password = cells[3].textContent;

        fileContent +=
            websiteName + "," + websiteLink + "," + username + "," + password + "\n";
    }

    const passphrase = "YourSecretPassphrase";
    const encryptedContent = CryptoJS.AES.encrypt(fileContent, passphrase).toString();

    const filename = "passwords.lclv";
    const blob = new Blob([encryptedContent], { type: "text/plain" });

    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = URL.createObjectURL(blob);

    anchor.target = "_blank";
    anchor.click();

    URL.revokeObjectURL(anchor.href);

    Swal.fire({
        icon: 'success',
        title: 'Passwords Saved',
        text: 'Passwords saved and file downloaded successfully!'
    });
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    Swal.fire({
        icon: 'success',
        title: 'Password Copied',
        text: 'Password copied to clipboard successfully!'
    });
}

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

            const passphrase = "YourSecretPassphrase";
            const decryptedContent = CryptoJS.AES.decrypt(encryptedText, passphrase).toString(CryptoJS.enc.Utf8);

            let firstLine = decryptedContent.trim().split("\n")[0];
            if (firstLine.toString().replace(/\s/g, "") === localVaultFileKey.toString()) {
                console.log("FIRST LINE MATCHES LOCALVAULT KEY");

                const tableBody = document.getElementById("passwordTableBody");
                tableBody.innerHTML = "";

                const rows = decryptedContent.trim().split("\n");

                for (let i = 1; i < rows.length; i++) {
                    const rowValues = rows[i].split(",");
                    const websiteName = rowValues[0];
                    const websiteLink = rowValues[1];
                    const username = rowValues[2];
                    const password = rowValues[3];

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
                    cell4.classList.add("password-cell");
                    cell4.addEventListener("click", function () {
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

                encoderAccess();
                uploadedFileText = decryptedContent;

                Swal.fire({
                    icon: 'success',
                    title: 'File Uploaded',
                    text: 'Uploaded file decrypted and passwords loaded successfully!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                });
            }
        };
        reader.readAsText(file);
    });

    document.body.appendChild(fileUpload);
    fileUpload.click();
    document.body.removeChild(fileUpload);
}

let editRow = null;

function deletePasswordSet(row) {
    const tableBody = document.getElementById("passwordTableBody");
    tableBody.removeChild(row);

    // Show success notification
    Swal.fire({
        icon: 'success',
        title: 'Password Deleted',
        text: 'Password set deleted successfully!'
    });
}

function editPasswordSet(row) {
    const tableRow = row;
    const cells = tableRow.cells;

    const websiteName = cells[0].textContent;
    const websiteLink = cells[1].textContent;
    const username = cells[2].textContent;
    const password = cells[3].textContent;

    window.scrollTo(0, document.body.scrollHeight);

    document.getElementById("websiteName").value = websiteName;
    document.getElementById("websiteLink").value = websiteLink;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;

    document.getElementById("passwordFormSubmitButton").value = "CHANGE?";

    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });
    tableRow.classList.add('highlighted-row');

    document.getElementById("passwordFormCancelButton").style.display = "inline";

    editRow = tableRow;
}

document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();

    document.getElementById("passwordFormSubmitButton").value = "ADD";
    document.getElementById("passwordFormCancelButton").style.display = "none";

    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });

    const websiteName = document.getElementById("websiteName").value;
    const websiteLink = document.getElementById("websiteLink").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (editRow) {
        const cells = editRow.cells;
        cells[0].textContent = websiteName;
        cells[1].innerHTML = websiteLink !== "" ? `<a href="${websiteLink}" target="_blank">${websiteLink}</a>` : "";
        cells[2].textContent = username;
        cells[3].textContent = password;

        editRow = null;

        Swal.fire({
            icon: 'success',
            title: 'Password Updated',
            text: 'Password set updated successfully!'
        });
    } else {
        const tableBody = document.getElementById("passwordTableBody");
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
        cell4.classList.add("password-cell");
        cell4.addEventListener("click", function () {
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

        Swal.fire({
            icon: 'success',
            title: 'Password Added',
            text: 'New password set added successfully!'
        });
    }

    document.getElementById("websiteName").value = "";
    document.getElementById("websiteLink").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
});

function editPasswordCancel() {
    document.getElementById("passwordFormCancelButton").style.display = "none";

    document.getElementById("websiteName").value = "";
    document.getElementById("websiteLink").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    let highlightedRowsArray = Array.from(document.getElementsByClassName("highlighted-row"));
    highlightedRowsArray.forEach(row => {
        row.classList.remove("highlighted-row");
    });

    editRow = null;

    Swal.fire({
        icon: 'info',
        title: 'Edit Cancelled',
        text: 'Edit operation cancelled.'
    });
}
