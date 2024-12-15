import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

export const mongodb = (app) => {
  const connection = process.env.MONGODB_URI

  const database = new URL(connection).pathname.substring(1)
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))

  app.set('mongodbClient', mongoClient)
}
