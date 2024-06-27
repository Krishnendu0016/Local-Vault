---

# LocalVault Password Encoder

LocalVault is a simple password management system that allows you to securely store and manage your passwords locally on your device.

## Features

- **Create New Database:** Create a new password database file for storing passwords.
- **Access Existing Database:** Access and modify existing passwords stored in the database.
- **Save / Export:** Encrypt and save your passwords to a file for secure storage.

## Getting Started

### Prerequisites

- Web browser with JavaScript enabled.

### Installation

1. Clone the repository or download the ZIP file.
2. Open `index.html` in your web browser.

### Usage

- **Create New Database:** Click on "CREATE" to create a new password database file.
- **Access Existing Database:** Click on "ACCESS" to upload and decrypt an existing password database file (`*.lclv`).
- **Add Passwords:** Fill in the required fields (Website Name, Password) in the form and click "ADD".
- **Edit Passwords:** Click on "Edit" in the table row to modify a password entry.
- **Delete Passwords:** Click on "Delete" in the table row to remove a password entry.
- **Save / Export:** Click on "SAVE / EXPORT" to encrypt and download your passwords as a `passwords.lclv` file.

## Security Note

- Ensure to choose a strong passphrase when prompted, as it will be used for encrypting and decrypting your password database.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Encryption:** CryptoJS for AES encryption/decryption
- **Libraries:** SweetAlert2 for notification 

---

### Additional Notes:

- **Security:** Always remember to keep your passphrase secure and not share it with anyone.
- **Feedback:** We welcome your feedback and suggestions. Please submit any issues or feature requests [here](https://github.com/Krishnendu0016/Local-Vault/issues).
