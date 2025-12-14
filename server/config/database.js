const mongoose = require('mongoose');

/**
 * Connect to MongoDB using connection string from environment variable
 */
async function connectDatabase() {
  const connectionString = process.env.DB_CONNECTION_STRING;
  
  if (!connectionString) {
    console.warn('⚠️  DB_CONNECTION_STRING not set. Database features will be disabled.');
    return null;
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB database');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Continuing without database. API will use external/mock data.');
    return null;
  }
}

/**
 * Disconnect from database
 */
async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  mongoose
};
