import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as wa from '@open-wa/wa-automate';

const SESSION_FILE_PATH = path.resolve(__dirname, 'session.json');
const CSV_FILE_PATH = path.resolve(__dirname, 'responses.csv');
const LOG_FILE_PATH = path.resolve(__dirname, 'bot_logs.txt');

let responseDict: { [key: string]: string } = {};
let client: any; // Define client globally to access in different functions

// Load responses from CSV
async function loadResponses(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(CSV_FILE_PATH)) {
            console.error(`Error: ${CSV_FILE_PATH} does not exist.`);
            console.log('Please create a responses.csv file with "message" and "response" columns.');
            reject(new Error('CSV file not found'));
        }

        const newResponseDict: { [key: string]: string } = {}; // Temporary dictionary for new responses

        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv())
            .on('data', (row: { message: string, response: string }) => {
                newResponseDict[row.message.toLowerCase()] = row.response;
            })
            .on('end', () => {
                responseDict = newResponseDict; // Update response dictionary
                console.log('CSV file successfully processed and responses updated.');
                resolve();
            })
            .on('error', (error) => {
                console.error(`Error reading CSV file: ${error.message}`);
                reject(error);
            });
    });
}

// Save logs to file
function logMessage(message: string) {
    const timestamp = new Date().toLocaleString();
    const log = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE_PATH, log);
}

// Get response based on received message
function getResponse(message: string): string | undefined {
    const lowercaseMessage = message.toLowerCase();
    return responseDict[lowercaseMessage];
}

// Process incoming messages
async function processMessage(message: any) {
    try {
        const { from, body, isGroupMsg } = message;

        // Check if the message is from a group
        if (isGroupMsg) {
            logMessage(`Received message in group from ${from}: ${body}`);
            return; // Exit without responding in groups
        }

        // Get response based on the message
        const response = getResponse(body);

        // Respond if there is a valid response
        if (response) {
            await client.sendText(from, response);
            logMessage(`Sent to ${from}: ${response}`);
        } else {
            logMessage(`Message not understood: ${body}`);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        logMessage(`Error processing message: ${error}`);
    }
}

// Initialize WhatsApp client and start the bot
async function initWhatsApp() {
    try {
        await loadResponses(); // Load initial responses from CSV

        client = await wa.create({
            sessionId: 'session', // Session name
            qrTimeout: 0, // Wait indefinitely for QR scan
            headless: true, // Headless chrome
            devtools: false, // Open devtools by default
            useChrome: true, // If false will use Chromium instance
            debug: false, // Opens a debug session
            logConsole: false, // Disable console logging
            popup: true, // Show QR code in popup window
            blockCrashLogs: true // Block crash logs
        });

        // Listen for incoming messages
        client.onMessage(async (message: any) => {
            await processMessage(message);
        });

        console.log('WhatsApp bot is now running...');

        // Check for updates in responses.csv every 60 seconds
        setInterval(async () => {
            console.log('Checking for updates in responses.csv...');
            await loadResponses();
        }, 1 * 60 * 1000); // 60 seconds interval

    } catch (error) {
        console.error('Error initializing WhatsApp with wa-automate:', error);
        logMessage(`Error initializing WhatsApp with wa-automate: ${error}`);
        process.exit(1); // Exit with error status code
    }
}

// Handle graceful exit
process.on('SIGINT', () => {
    console.log('\nClosing bot gracefully...');
    if (client) {
        client.killSession();
    }
    process.exit(0);
});

// Run the WhatsApp initialization
initWhatsApp(); // Use initWhatsApp() for wa-automate
