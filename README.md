
---

# LocalVault Password Encoder

LocalVault is a secure password manager that allows users to create, access, and manage their passwords in a local database. This application provides encryption for stored passwords and includes features to add, update, delete, and save passwords.

## Features

- **Create New Password Database**: Start a new password database with encryption.
- **Access Existing Database**: Upload and view an existing password database.
- **Add Passwords**: Add new passwords to the database.
- **Update Passwords**: Edit existing passwords in the database.
- **Delete Passwords**: Remove passwords from the database.
- **Save Passwords**: Save the encrypted password database locally.
- **Clipboard Copy**: Copy passwords to the clipboard with a single click.
- **Pop-up Notifications**: Informative notifications for user actions.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Encryption**: CryptoJS
- **Notifications**: SweetAlert2

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Krishnendu0016/localvault.git
   cd localvault
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the backend server**

   ```bash
   node server.js
   ```

4. **Open `index.html` in your browser**

### Usage

1. **Create New Password Database**

   - Click on the "CREATE" button to start a new password database.

2. **Access Existing Database**

   - Click on the "ACCESS" button to upload an existing `.lclv` password database file.

3. **Add Passwords**

   - Fill in the form with website name, link, username, and password, then click "ADD".

4. **Update Passwords**

   - Click the "Edit" button next to a password, modify the details, and click "CHANGE?".

5. **Delete Passwords**

   - Click the "Delete" button next to a password to remove it from the database.

6. **Save Passwords**

   - Click the "SAVE / EXPORT" button to save the encrypted password database locally.

### Backend API

The backend API provides routes to interact with the MongoDB database.

- **Add Password**
  
  ```http
  POST /passwords
  {
    "websiteName": "Example",
    "websiteLink": "https://example.com",
    "username": "user",
    "password": "pass"
  }
  ```

- **Get All Passwords**

  ```http
  GET /passwords
  ```

- **Update Password**

  ```http
  PUT /passwords/:id
  {
    "websiteName": "Example Updated",
    "websiteLink": "https://example.com",
    "username": "user",
    "password": "newpass"
  }
  ```

- **Delete Password**

  ```http
  DELETE /passwords/:id
  ```

### Frontend JavaScript Functions

- **saveEncodedPasswords**: Saves the password database as an encrypted file.
- **encoderAccess**: Displays the password management interface.
- **encoderPromptFile**: Prompts the user to upload an existing password database file.
- **copyToClipboard**: Copies a password to the clipboard.
- **editPasswordSet**: Edits a password entry.
- **editPasswordCancel**: Cancels the password edit operation.
- **deletePasswordSet**: Deletes a password entry.

### Notifications

SweetAlert2 is used for displaying notifications for various user actions, such as adding, updating, deleting, and saving passwords.


## Acknowledgements

- [CryptoJS](https://cryptojs.gitbook.io/docs/)
- [SweetAlert2](https://sweetalert2.github.io/)

--- 
