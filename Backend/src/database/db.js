import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';


const connectDb = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n Mongodb connected successfully${connect.connection.host }`);
    } catch (error) {
       console.error(`mongodb connection error: ${error.message}`); 
       process.exit(1);
    }
}
export default connectDb;
