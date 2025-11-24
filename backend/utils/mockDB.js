const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'mock_db', 'users.json');
const logsPath = path.join(__dirname, '..', 'mock_db', 'logs.json');

const loadUsers = () => {
    try {
        const data = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading users mock DB, returning empty array:", error.message);
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
};

const loadLogs = () => {
    try {
        const data = fs.readFileSync(logsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading logs mock DB, returning empty array:", error.message);
        return [];
    }
};

const saveLogs = (logs) => {
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2), 'utf8');
};

module.exports = { loadUsers, saveUsers, loadLogs, saveLogs };