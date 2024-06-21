"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var csv = require("csv-parser");
var wa = require("@open-wa/wa-automate");
var SESSION_FILE_PATH = path.resolve(__dirname, 'session.json');
var CSV_FILE_PATH = path.resolve(__dirname, 'responses.csv');
var LOG_FILE_PATH = path.resolve(__dirname, 'bot_logs.txt');
var responseDict = {};
var client; // Define client globally to access in different functions
// Load responses from CSV
function loadResponses() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!fs.existsSync(CSV_FILE_PATH)) {
                        console.error("Error: ".concat(CSV_FILE_PATH, " does not exist."));
                        console.log('Please create a responses.csv file with "message" and "response" columns.');
                        reject(new Error('CSV file not found'));
                    }
                    var newResponseDict = {}; // Temporary dictionary for new responses
                    fs.createReadStream(CSV_FILE_PATH)
                        .pipe(csv())
                        .on('data', function (row) {
                        newResponseDict[row.message.toLowerCase()] = row.response;
                    })
                        .on('end', function () {
                        responseDict = newResponseDict; // Update response dictionary
                        console.log('CSV file successfully processed and responses updated.');
                        resolve();
                    })
                        .on('error', function (error) {
                        console.error("Error reading CSV file: ".concat(error.message));
                        reject(error);
                    });
                })];
        });
    });
}
// Save logs to file
function logMessage(message) {
    var timestamp = new Date().toLocaleString();
    var log = "[".concat(timestamp, "] ").concat(message, "\n");
    fs.appendFileSync(LOG_FILE_PATH, log);
}
// Get response based on received message
function getResponse(message) {
    var lowercaseMessage = message.toLowerCase();
    return responseDict[lowercaseMessage];
}
// Process incoming messages
function processMessage(message) {
    return __awaiter(this, void 0, void 0, function () {
        var from, body, isGroupMsg, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    from = message.from, body = message.body, isGroupMsg = message.isGroupMsg;
                    // Check if the message is from a group
                    if (isGroupMsg) {
                        logMessage("Received message in group from ".concat(from, ": ").concat(body));
                        return [2 /*return*/]; // Exit without responding in groups
                    }
                    response = getResponse(body);
                    if (!response) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.sendText(from, response)];
                case 1:
                    _a.sent();
                    logMessage("Sent to ".concat(from, ": ").concat(response));
                    return [3 /*break*/, 3];
                case 2:
                    logMessage("Message not understood: ".concat(body));
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error processing message:', error_1);
                    logMessage("Error processing message: ".concat(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Initialize WhatsApp client and start the bot
function initWhatsApp() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, loadResponses()];
                case 1:
                    _a.sent(); // Load initial responses from CSV
                    return [4 /*yield*/, wa.create({
                            sessionId: 'session', // Session name
                            qrTimeout: 0, // Wait indefinitely for QR scan
                            headless: true, // Headless chrome
                            devtools: false, // Open devtools by default
                            useChrome: true, // If false will use Chromium instance
                            debug: false, // Opens a debug session
                            logConsole: false, // Disable console logging
                            popup: true, // Show QR code in popup window
                            blockCrashLogs: true // Block crash logs
                        })];
                case 2:
                    client = _a.sent();
                    // Listen for incoming messages
                    client.onMessage(function (message) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, processMessage(message)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    console.log('WhatsApp bot is now running...');
                    // Check for updates in responses.csv every 60 seconds
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('Checking for updates in responses.csv...');
                                    return [4 /*yield*/, loadResponses()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 60 * 1000); // 60 seconds interval
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error initializing WhatsApp with wa-automate:', error_2);
                    logMessage("Error initializing WhatsApp with wa-automate: ".concat(error_2));
                    process.exit(1); // Exit with error status code
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Handle graceful exit
process.on('SIGINT', function () {
    console.log('\nClosing bot gracefully...');
    if (client) {
        client.killSession();
    }
    process.exit(0);
});
// Run the WhatsApp initialization
initWhatsApp(); // Use initWhatsApp() for wa-automate
