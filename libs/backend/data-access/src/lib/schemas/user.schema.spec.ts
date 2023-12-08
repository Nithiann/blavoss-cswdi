import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server"
import { User, UserDocument, UserSchema } from "./user.schema";
import { validate } from 'uuid';
import { Model, disconnect } from "mongoose";
import { Gender, userRole } from "@blavoss-cswdi/shared/api";

describe('User schema', () => {
    let mongod: MongoMemoryServer;
    let userModel: Model<UserDocument>;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        return { uri: mongod.getUri() };
                    },
                }),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
            ],
        }).compile();

        userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

        await userModel.ensureIndexes();
    });

    afterAll(async () => {
        await mongod.stop();
        await disconnect();
    });

    it('has a default uuid', () => {
        const model = new userModel();

        expect(validate(model._id)).toBeDefined();
    });

    it('has a required email', () => {
        const model = new userModel();

        const err = model.validateSync();

        expect(err?.errors['email']).toBeInstanceOf(Error);
    });

    it('has a unique email', async () => {
        const orig = new userModel({ email: 'test@test.com', firstName: 'test', lastName: 'test', hash: 'test', dob: new Date(), gender: Gender.Male, role: userRole.User });
        const dup = new userModel({ email: 'test@test.com', firstName: 'test', lastName: 'test', hash: 'test', dob: new Date(), gender: Gender.Male, role: userRole.User });
        console.log('Original User:', orig.toObject());
        console.log('Duplicate User:', dup.toObject());
        await orig.save();

        await expect(dup.save()).rejects.toThrow();
    });

    it('has a required firstName', () => {
        const model = new userModel();

        const err = model.validateSync();

        expect(err?.errors['firstName']).toBeInstanceOf(Error);
    });

    it('has empty tickets list', async () => {
        const model = new userModel({ email: 'john@test.com', firstName: 'test', lastName: 'test', hash: 'test', dob: new Date(), gender: Gender.Male, role: userRole.Admin });

        await model.save();

        expect(model.tickets).toEqual([]);
    })
})