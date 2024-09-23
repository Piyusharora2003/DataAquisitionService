export function AnomolyChecker (data) {
    const {HR , BP , T , G , O2} = data;
    let message = [];
    let isSafe = true;
    if (HR < 60 || HR > 100) {
        message.push('Heart rate is too high');
        isSafe = false;
    }

    {
        const {hbp, lbp} = BP.split('/');
        if (hbp < 90 || hbp > 120) {
            message.push('Blood pressure is too low');
            isSafe = false;
        }
        if (lbp < 60 || lbp > 80) {
            message.push('Blood pressure is too high');
            isSafe = false;
        }
    }

    if (T < 36 || T > 37.8) {
        message.push('Temperature is too high');
        isSafe = false;
    }
    
    if (G < 70 || G > 150) {
        message.push('Glucose is too high');
        isSafe = false;
    }

    if (O2 < 94) {
        message.push('Oxygen saturation is too low');
        isSafe = false;
    }

    return {
        isSafe,
        message
    };
};

/*  INPUT DATA
    {Field: Value: Safe range }
        HR: heart rate : 60-100,
        BP: blood pressure : 90-120/60-80,
        T:  temperature : 36.1-37.2,
        G:  glucose : 70-100,
        O2: oxygen saturation: 95-100,
    }
*/

/* 
    OUTPUT DATA
    {
        isSafe: true/false,
        message: ['Heart rate is too high', blood pressure is too low, etc.] or []
    }
*/