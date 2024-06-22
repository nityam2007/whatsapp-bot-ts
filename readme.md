**WhatsApp Bot using wa-automate**

This document provides instructions for setting up and using a simple WhatsApp bot implemented in TypeScript using wa-automate. The bot reads messages from users and responds based on predefined responses loaded from a CSV file.

**Features:**

-   Responds to incoming WhatsApp messages based on predefined responses.
-   Supports reading and updating responses from a CSV file (responses.csv).
-   Logs interactions and errors to bot_logs.txt.
-   Gracefully handles session management and exit.

**Requirements:**

-   Node.js (v14 or higher)
-   npm
-   WhatsApp account

**Setup Instructions:**

  **Clone the repository:**

```
git clone https://github.com/nityam2007/whatsapp-bot-ts.git

cd whatsapp-bot-ts
```

  **Install dependencies:**
```
npm install
```
  **Prepare your environment:**

-   Create a session.json file in the root directory to store WhatsApp session data.
-   Prepare a responses.csv file with columns message and response containing the messages and corresponding responses respectively.

  **Run the bot:**

Start the WhatsApp bot using the following command:
```
node whatsapp-bot.js
```
This command initializes the bot, loads initial responses from responses.csv, and starts listening for incoming messages.

  **Interact with the bot:**

-   Scan the QR code using your WhatsApp account to link it with the bot.
-   The bot will now respond to incoming messages based on the responses defined in responses.csv.

  **Updating Responses:**

To update responses dynamically, edit the responses.csv file. The bot will automatically reload the file every 60 seconds (configurable) to update its responses.

**Steps to update responses:**

-   Open responses.csv in a text editor or spreadsheet application.
-   Modify or add new entries in the message and response columns.
-   Save the file. The bot will detect changes and update its responses within the next 60 seconds.

  **Customizing the Bot:**

To customize the bot's functionality or behavior, you can edit the TypeScript files provided:

-   index.ts: Main file handling bot initialization and message processing.
-   utils.ts (if present): Utility functions used in the bot logic.

Modify these files to add new features, change response logic, or integrate with external APIs.

  **Compiling TypeScript (if necessary):**

If you modify TypeScript files and need to compile them to JavaScript:
```
tsc whatsapp-bot.ts
```
This step compiles TypeScript files into JavaScript files located in the dist directory.

  **Restart the bot:**

After making changes to the code, restart the bot using:
```
node whatsapp-bot.js
```
This reloads the bot with your updated code and configuration.

  **Exiting the bot:**

To stop the bot, press Ctrl+C in the terminal. This will gracefully exit the bot and kill the WhatsApp session.
