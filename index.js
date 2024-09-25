import dotenv from 'dotenv';
import { io } from "socket.io-client";
import { AnomolyChecker } from './AnomolyChecker.js';
import { FirebaseWorker } from './FirebaseWorker.js';
import { userDataClass } from './userDataClass.js';

dotenv.config();

const socket = io(process.env.SOCKET_URL);
let userdata = new userDataClass();

let firebaseWorker = new FirebaseWorker();
firebaseWorker.init();

socket.on('newData', (data) => {
    if (typeof data !== 'object' || data == null) {
        console.log('No more data to receive');
        socket.disconnect();
        userdata.push_to_cloud(firebaseWorker);
        process.exit(0);
    }
    else {
        console.log(data);

        userdata.insert(data);

        if (userdata.time_elapsed() > process.env.MAX_TIME_STORE_CAP) {
            userdata.push_to_cloud(firebaseWorker);
        }
        
        const AnomolyCheckerResult = AnomolyChecker(data);
        if (AnomolyCheckerResult.isSafe === false) {
            console.warn('Anomoly detected :  ', AnomolyCheckerResult.message);
            // TODO: send alert to alert service
        }
    }
});

