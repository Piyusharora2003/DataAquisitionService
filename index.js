import dotenv from 'dotenv';
import { io } from "socket.io-client";
import { AnomolyChecker } from './AnomolyChecker.js';

dotenv.config();

const socket = io(process.env.SOCKET_URL);

let userdata = []

socket.on('newData', (data) => {
    
    if (typeof data !== 'object') {
        console.log('No more data to receive');
        socket.disconnect();
        process.exit(0);
    }
    else {
        console.log(data);
        const AnomolyCheckerResult = AnomolyChecker(data);
        if (AnomolyCheckerResult.isSafe === false) {
            console.warn('Anomoly detected :  ', AnomolyCheckerResult.message);
            // TODO: send alert to alert service
        }
    }
});

