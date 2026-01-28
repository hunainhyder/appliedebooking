# 🎟️ UniEvent - Serverless Ticket Booking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)

A lightweight, $0 cost ticket booking and attendance system designed for university events. It uses **Google Sheets as a database** and **Google Apps Script as the backend API**, with a **React (Vite)** frontend.

## 🌟 Features

### 🌍 Public Side (User)
* **Instant Booking:** Simple form to purchase tickets.
* **QR Code Generation:** Automatically generates a unique QR ticket upon successful booking.
* **Downloadable Ticket:** Users can save their QR code for entry.

### 🔒 Admin Side
* **Secure Dashboard:** Password-protected area for event organizers.
* **Live Analytics:** View total bookings and calculated revenue.
* **QR Scanner:** Built-in camera scanner to verify tickets in real-time.
* **Duplicate Prevention:** Checks if a ticket has already been scanned/used.

---

## 🏗️ Architecture

This project uses a "No-DB" approach:

1.  **Frontend:** React + Vite (Hosted on Netlify)
2.  **Backend:** Google Apps Script (Web App Deployment)
3.  **Database:** Google Sheets (Stores user data & status)

```mermaid
graph LR
A[User] -- Book Ticket --> B(React App)
C[Admin] -- Scan QR --> B
B -- JSON POST --> D{Google Apps Script}
D -- Read/Write --> E((Google Sheets))
