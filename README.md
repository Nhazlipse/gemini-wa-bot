# Nas AI - Multifunctional WhatsApp Bot

A simple WhatsApp bot powered by Google's Gemini AI, with the capability to create custom stickers. Built as a project to explore AI integration with chat platforms.

Developed by: **[@nhazlipse] (https://github.com/nhazlipse)**

---

## Key Features

- **🤖 AI Chat**: Interact directly with Google's Gemini AI model using the `.ai` command.
- **🎨 Sticker Maker**: Easily create WhatsApp stickers from any image you send, with or without custom text.
- **👋 Welcome Message**: Automatically greets new users when they send their first message (in private chats only).
- **🔒 Local Session**: Uses `whatsapp-web.js` with the `LocalAuth` strategy to save your session, so you don't need to scan the QR code every time you start the bot.

---

## Prerequisites

Before you begin, ensure you have the following:

1.  **Node.js** version 18 or newer.
2.  A **WhatsApp account** to be used for the bot (using a secondary number is recommended).
3.  A **Gemini API Key** from [Google AI Studio] (https://aistudio.google.com/app/apikey).

---

## Installation & Configuration

1.  **Clone or Download This Repository**
    ```bash
    git clone [https://github.com/nhazlipse/gemini-wa-bot.git]
    cd gemini-wa-bot
    ```

2.  **Install All Required Packages**
    Run the following command in your terminal:
    ```bash
    npm install
    ```

3.  **Configure the API Key**
    - Create a new file in the project's root folder named `.env`.
    - Open the `.env` file and add your Gemini API Key in the following format:
      ```
      GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
      ```

---

## Running the Bot

1.  Start the bot with the command:
    ```bash
    npm start
    ```

2.  On the first run, a **QR code** will appear in the terminal.
3.  Open WhatsApp on your phone, go to **Settings > Linked Devices > Link a Device**, and scan the QR code.
4.  Once successfully connected, the terminal will show the message `Bot WhatsApp sudah siap dan terhubung!`. Your bot is now ready to use.

---

## Usage

-   **AI Chat**: Send a message with the format `.ai [your question]`.
    > Example: `.ai explain black holes`

-   **Sticker Maker**: Send an image with a caption.
    - Example: `.stiker`

---