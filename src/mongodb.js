import { MongoClient } from 'mongodb'

// const mongodbUri = process.env.MONGODB_URI
// if (!mongodbUri) {
//   throw new Error('MONGODB_URI environment variable is not set')
// }
export const mongodb = (app) => {
  const connection = app.get('mongodb')
  const database = new URL(connection).pathname.substring(1)
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))

  app.set('mongodbClient', mongoClient)
}
