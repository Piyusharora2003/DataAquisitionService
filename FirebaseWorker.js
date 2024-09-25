import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

export class FirebaseWorker {

    init = function () {
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        // push message instance to be created here 
    }

    addUserData = async function (UserId , data) {
        try {
        // TODO : add a type check for data
        console.log(data);
          const docRef = await addDoc(collection(this.db, "user#" + UserId) , data);
          return true;          
        } catch (e) {
          console.error("Error adding document: ", e);
          return false;
        }
    }


}

/*
    data: {
        HR_avg;
        T_avg ;
        G_avg;
        BP_avg ;
    }
*/