/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import bcrypt from 'bcrypt';
import User from '../models/OAuthUser.js';
import Client from '../models/OAuthClient.js'

const { SEED_DEFAULT_PASS, SEED_OAUTH_ID, SEED_OAUTH_SECRET } = process.env;

class Seeder {
    constructor() {
        const passwordSalt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(SEED_DEFAULT_PASS, passwordSalt);

        const adminUser = { 
            username: 'admin',
            password: hashedPassword,
            scope: 'manager', 
        };

        const kitchenUser = { 
            username: 'kitchen',
            password: hashedPassword,
            scope: 'kitchen', 
        };

        const warehouseUser = { 
            username: 'warehouse',
            password: hashedPassword,
            scope: 'warehouse', 
        };

        this.users = [adminUser, kitchenUser, warehouseUser];
    }

    async insertData () {
        const promises = [];
        this.users.forEach(user => {
            const promise = User.findOne({username : user.username}, (err, data) => {
                if (!data) {
                    return User.create(user)
                    .then((inserted) => {
                        const client = {
                            clientId: SEED_OAUTH_ID,
                            clientSecret: SEED_OAUTH_SECRET,
                            scope: inserted.scope,
                            user: inserted._id,
                            name: `${inserted.username}Client`,
                        };
                        return Client.create(client);
                    });
                } 
                return true;
            });
            promises.push(promise);
        });

        return Promise.all(promises);
    }
}

export default Seeder;
