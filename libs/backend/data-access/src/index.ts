export * from './lib/data-access.module';
export * from './lib/schemas/user.schema';
console.log(`${process.env['MONGO_SERVER']}://${process.env['MONGO_USER']}:${process.env['MONGO_PASS']}@${process.env['MONGO_HOST']}:${process.env['MONGO_PORT']}`)