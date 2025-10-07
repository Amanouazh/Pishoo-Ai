# Pishoo AI

## 🎯 Goal

Pishoo AI is a fully functional web application inspired by the Manus AI interface, designed to allow users to chat with Gemini models using their own Gemini API keys. The application is built to be easily deployable on a Virtual Private Server (VPS) running Ubuntu 22.04 LTS.

## 🧩 Main Objectives

1.  **Modern UI similar to Manus AI**: Features a clean chat interface with light/dark themes, a responsive sidebar for navigation (Home, Projects, Tools, Settings), and a floating command palette (Ctrl + K) for quick actions.
2.  **Gemini API Integration**: Users provide their personal Gemini API key, which is stored locally in the browser (localStorage or IndexedDB) and never sent to the server.
3.  **Minimal Backend**: A Flask (Python) backend serves the static frontend files and is prepared for Nginx reverse proxy setup.

## ⚙️ Technical Specifications

### 🖥️ Frontend

*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS
*   **Animations**: Framer Motion
*   **Key Features**:
    *   Local chat storage
    *   Model selection (Gemini 1.5 Flash, Pro, etc.)
    *   Export/import chat history as JSON
    *   Markdown + code block rendering
    *   Responsive design (desktop + mobile)
    *   Optional Tools section for AI utilities (Text Analysis, Code Writer, etc.)

### ⚙️ Backend

*   **Framework**: Flask (Python)
*   **Purpose**: Serves the static frontend and handles optional user authentication (not implemented in this version but ready for extension).
*   **Deployment Preparation**: Configured for Nginx reverse proxy setup.

### 🧰 Deployment

*   **VPS**: Ubuntu 22.04 LTS
*   **Tools**: Nginx + Gunicorn (for Python)
*   **Automation**: Includes a `deploy.sh` bash script for automated setup and deployment.

## 🧱 Folder Structure

```
pishoo-ai/
├── backend/
│   ├── src/
│   │   ├── main.py
│   │   └── static/ # Built frontend assets are copied here
│   ├── venv/
│   ├── requirements.txt
│   └── start_gunicorn.sh
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── nginx.conf
├── deploy.sh
└── README.md
```

## 🚀 Deployment Guide (for Ubuntu 22.04 VPS)

This guide assumes you have a fresh Ubuntu 22.04 LTS VPS with `sudo` privileges and `git` installed.

1.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url> pishoo-ai
    cd pishoo-ai
    ```
    *(Note: Replace `<your-repo-url>` with the actual URL of your Pishoo AI repository.)*

2.  **Make `deploy.sh` Executable**:
    ```bash
    chmod +x deploy.sh
    ```

3.  **Run the Deployment Script**:
    ```bash
    sudo ./deploy.sh
    ```
    The script will:
    *   Update system packages and install Nginx, Python3-venv, pip.
    *   Install `pnpm` if not present.
    *   Install frontend dependencies and build the React application.
    *   Set up a Python virtual environment for the backend and install dependencies (Flask, Gunicorn).
    *   Copy the built frontend assets to the backend's static directory.
    *   Configure Nginx to reverse proxy requests to the Flask application.
    *   Set up a `systemd` service to manage the Gunicorn server, ensuring the Flask app runs continuously.

4.  **Update `your_domain.com`**: Before running `deploy.sh`, you **MUST** edit the `nginx.conf` file or modify the `deploy.sh` script to replace `your_domain.com` with your actual domain name.

5.  **Firewall Configuration**: Ensure ports 80 (HTTP) and 443 (HTTPS, if you configure SSL) are open in your VPS firewall.

After successful execution, Pishoo AI should be accessible via your configured domain name.

## 💡 Usage Instructions

1.  **Access the Application**: Open your web browser and navigate to your deployed domain (e.g., `http://your_domain.com`).
2.  **Set API Key**: Go to the **Settings** page (via the sidebar or Ctrl+K command palette) and enter your Gemini API key. This key is stored locally in your browser.
3.  **Start Chatting**: Click "New Chat" in the sidebar or on the welcome screen to begin a new conversation with the Gemini AI model.
4.  **Model Selection**: Choose your preferred Gemini model (Flash, Pro) from the dropdown in the chat interface.
5.  **Export/Import Chats**: Use the export/import buttons in the chat interface to save or load your chat history as JSON files.
6.  **Command Palette**: Press `Ctrl + K` (or `Cmd + K` on Mac) to open the command palette for quick access to actions like starting a new chat, toggling the sidebar, or changing themes.

## ✨ Optional Enhancements (Future Considerations)

*   Chat search bar
*   "Continue Chat" options
*   Tooltip hints
*   Agent task templates (e.g., "Summarize," "Analyze," "Brainstorm")

## 📜 Credits & Version Info

*   **Version**: 1.0.0
*   **Author**: Manus AI
*   **Inspired by**: Manus AI Interface
*   **Technologies**: React, Vite, TailwindCSS, Framer Motion, Flask, Gunicorn, Nginx, Systemd
*   **GitHub**: [Link to your GitHub repository (if public)]

Built with ❤️ for a seamless AI chat experience.
