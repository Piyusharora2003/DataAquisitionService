function setdecimalpoints(num , n) {
    return Math.round(num * Math.pow(10,n)) / Math.pow(10,n) ;
}

export class userDataClass {
    entries_count = 0;
    HR_avg = 0;
    T_avg = 0;
    G_avg =  0;
    BP_avg = '0/0';

    constructor () {
        this.creation_time = new Date().toUTCString();
    }

    insert = function (data) {
        this.HR_avg = setdecimalpoints (( this.entries_count * this.HR_avg + data.HR ) / (this.entries_count + 1) ,2);
        this.G_avg =  setdecimalpoints(( this.entries_count * this.G_avg + data.G ) / (this.entries_count + 1),2);
        this.T_avg =  setdecimalpoints(( this.entries_count * this.T_avg + data.T ) / (this.entries_count + 1),1);
        let [bp_high_avg , bp_low_avg] = this.BP_avg.split("/").map(e => Number(e));
        let [new_bp_high , new_bp_low] = data.BP.split("/").map(e => Number(e));
        bp_high_avg =  setdecimalpoints((this.entries_count * bp_high_avg + new_bp_high ) / (this.entries_count + 1),2);
        bp_low_avg =  setdecimalpoints((this.entries_count * bp_low_avg + new_bp_low ) / (this.entries_count + 1),2) ;
        this.BP_avg = bp_high_avg + "/" + bp_low_avg;
        this.entries_count++;
    }

    time_elapsed = () => {
        return (Date.now() - Date.parse(this.creation_time)) / 1000;
    }

    push_to_cloud = async function(firebaseWorker) {
        if (this.entries_count === 0) return ;
        this.frameDuration = this.time_elapsed();
        
        let dataToInsert = {
            average_heart_rate : this.HR_avg,
            average_body_temp: this.T_avg,
            average_gluecose_level : this.G_avg,
            average_bp : this.BP_avg, 
            creation_time: this.creation_time,
            ending_time: new Date().toUTCString(),
            totalTime: this.frameDuration
        }

        try {
            if (! await firebaseWorker.addUserData(process.env.USERID , dataToInsert)) {
                throw new Error("data not uploaded successfullly");
            }
            else {
                this.entries_count = 0;
                this.HR_avg = 0;
                this.T_avg = 0;
                this.G_avg =  0;
                this.BP_avg = '0/0';
                this.creation_time = new Date().toUTCString();
            }
        }
        catch (e) {
            console.warn("Error in adding data to db ..." , e);
        }

    }
}

// data type
// { HR: number, BP: '143/103', T: number, G: number, O2: number }