const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ users: [], lastId: 0 }).write();
console.log('Initialized JSON DB at', dbPath);
