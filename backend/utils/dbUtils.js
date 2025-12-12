const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// --- Collection Constants ---
const USER_COLLECTION = 'users';
const LOG_COLLECTION = 'logs';

// --- User Management Functions ---

/** Finds a single user by email or ID. */
const findUser = async (query) => {
  const db = getDb();
  let filter;

  if (query.includes('@')) {
    filter = { email: query };
  } else {
    try {
      filter = { _id: new ObjectId(query) };
    } catch (e) {
      return null;
    }
  }
  const user = await db.collection(USER_COLLECTION).findOne(filter);
  return user;
};

/** Finds a user by ID including the password field (for login). */
const findUserWithPassword = async (userId) => {
  const db = getDb();
  try {
    return await db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(userId) });
  } catch (e) {
    return null;
  }
};

/** Inserts a new user document. */
const createUser = async (userData) => {
  const db = getDb();
  return await db.collection(USER_COLLECTION).insertOne(userData);
};

/** Updates a user document by ID. */
const updateUser = async (userId, updateData) => {
  const db = getDb();
  try {
    return await db.collection(USER_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
  } catch (e) {
    console.error("Failed to update user:", e);
    return null;
  }
};

// --- Log Management Functions ---

/** Finds all logs for a specific user. */
const loadLogs = async (userId) => {
  const db = getDb();
  return await db.collection(LOG_COLLECTION)
    .find({ userId: userId })
    .sort({ date: -1 })
    .toArray();
};

/** Inserts a new log document. */
const addLog = async (logData) => {
  const db = getDb();
  return await db.collection(LOG_COLLECTION).insertOne({
    ...logData,
    date: new Date().toISOString(), 
  });
};


module.exports = {
  findUser,
  createUser,
  updateUser,
  loadLogs,
  addLog,
  findUserWithPassword,
};