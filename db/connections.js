require('dotenv').config();
const mongoose = require('mongoose');

const CONNECTION_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  readPreference: 'nearest'
};

let primaryConnection;
let stagingConnection;

const connectToDatabase = async (uri, label) => {
  const connection = mongoose.createConnection(uri, CONNECTION_OPTIONS);
  await connection.asPromise();

  connection.on('disconnected', () => {
    console.log(`Mongoose disconnected from ${label}`);
  });

  return connection;
};

const connectDatabases = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const stagingUri = process.env.MONGODB_URI_STAGING;

  if (!primaryUri) {
    throw new Error('Missing required env var: MONGODB_URI');
  }

  if (!stagingUri) {
    throw new Error('Missing required env var: MONGODB_URI_STAGING');
  }

  const [primary, staging] = await Promise.all([
    connectToDatabase(primaryUri, 'primary DB'),
    connectToDatabase(stagingUri, 'staging DB')
  ]);

  primaryConnection = primary;
  stagingConnection = staging;

  console.log('Connected to primary DB', primaryUri);
  console.log('Connected to staging DB', stagingUri);

  return {
    primaryConnection,
    stagingConnection
  };
};

const getConnection = ({ staging = false } = {}) => {
  if (staging) {
    if (!stagingConnection) {
      throw new Error('Staging DB connection is not initialized');
    }

    return stagingConnection;
  }

  if (!primaryConnection) {
    throw new Error('Primary DB connection is not initialized');
  }

  return primaryConnection;
};

module.exports = {
  connectDatabases,
  getConnection
};