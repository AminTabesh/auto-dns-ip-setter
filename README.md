# 🌐 IP Setter Terminal App

A colorful and interactive terminal app for managing IP assignments for **JIM SPEED** and **FIREOPS** services.  
It detects your public IP, automatically detects your country (with fallback to IR if detection fails), and allows interactive JWT token input for FireOps.

## 🎨 Features

- Colorful logs and emojis for a friendly terminal experience
- Option 1: JIM SPEED — sends your current IP to the service
- Option 2: FIREOPS — sends your current IP and detected country with JWT authentication
- Automatic country detection with fallback to `IR`
- Interactive JWT prompt if the token is invalid or expired
- Press **ESC** anytime to exit
- Works on **Windows**, **macOS**, and **Linux**

---

## ⚙️ Prerequisites

- **Node.js v18+** ([Download Node.js](https://nodejs.org))
- For macOS/Linux: optional `.sh` launcher
- For Windows: optional `.bat` launcher

---

## 🏃 How to Run

1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/ip-setter-app.git
```
cd ip-setter-app

2️⃣ Install dependencies

No extra dependencies needed (uses built-in fetch and readline in Node 18+).

3️⃣ Configure

Open set-ip.js

Replace the placeholder JWT for FireOps:

```javascript
let FIREOPS_JWT = 'PASTE_YOUR_JWT_HERE_IF_YOU_WANT';
```

4️⃣ Run the App
Windows (double-click)

Use the included run-ip.bat

Double-click the file to start the app

macOS/Linux

Use the included run-ip.sh:

Make it executable (first time only):

```bash

chmod +x run-ip.sh
```

Run:
```bash
./run-ip.sh
```

5️⃣ Usage

On start, select an option:

1. JIM SPEED
2. FIREOPS


JIM SPEED: sends your current IP to the service

FIREOPS: detects your country, sends request with JWT

If JWT is invalid/expired, you will be prompted to enter a new token

Press ESC at any time to exit the app

### 📌 Notes

- If country detection fails, IR is used by default

- No logs are saved to file by default; everything is printed to the terminal

- Compatible with Node 18+ (uses built-in fetch and readline)

🖌 Optional Improvements

- Save JWT to a local config.json

- Log all activity to a file

- Add additional services (Option 3, 4, …)

- Mask JWT input like a password

### ⚠️ Security

- JWT is stored only in memory

- No sensitive data is written to disk unless you choose to implement logging

