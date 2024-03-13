import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });

    this.asyncSetX = promisify(this.client.setex).bind(this.client);
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.isConnected;
  }

  async set(key, value, expiry) {
    try {
      await this.asyncSetX(key, expiry, value);
    } catch (err) {
      console.error('Error setting key in Redis:', err);
      throw err; // Rethrow to allow caller to handle error as well
    }
  }

  async get(key) {
    return this.asyncGet(key);
  }

  async del(key) {
    return this.asyncDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
