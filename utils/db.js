const { MongoClient } = require('mongodb');


class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB connection URI
    const uri = `mongodb://${host}:${port}`;

    // Create a new MongoClient
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = database;

    // Connect to the server
    this.client.connect()
      .then(() => {
        this.db = this.client.db(this.dbName);
        console.log("Successfully connected to MongoDB.");
      })
      .catch((err) => console.error("Connection to MongoDB failed", err));
  }

  // Check if the MongoDB connection is alive
  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  // Asynchronous function to return the number of users
  async nbUsers() {
    if (!this.isAlive()) return 0;
    const collection = this.db.collection('users');
    return await collection.countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) return 0;
    const collection = this.db.collection('files');
    return await collection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
