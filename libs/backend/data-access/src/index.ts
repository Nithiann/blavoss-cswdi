export * from './lib/data-access.module';
console.log(`${process.env.MONGO_SERVER}://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`)