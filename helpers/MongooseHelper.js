/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import '../models/OAuthAccessToken.js';
import '../models/OAuthAuthorizationCode.js';
import '../models/OAuthClient.js';
import '../models/OAuthRefreshToken.js';
import '../models/OAuthUser.js';
import '../models/OAuthScope.js';

class MongooseHelper {
    static startMongoConnection() {
        mongoose.connect(process.env.MONGO_HOST, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        const db = mongoose.connection;
        db.on('error', (e) => {
            // eslint-disable-next-line no-console
            console.log(e);
        });
    }
}

export default MongooseHelper;