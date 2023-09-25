
type Rules  = {
    fares: Array<{
        from: string;
        to: string;
        peak: number;
        nonPeak: number;
    }>;
    fareCaps: Array<{
        from: string;
        to: string;
        daily: number;
        weekly: number;
    }>;
    peakHours: {
        [key: string]: Array<{startHour: number, endHour: number}>
    }
}


const rules: Rules = {
    fares:[
        {
            from: "Green",
            to: "Green",
            peak: 2,
            nonPeak: 1
        },
        {
            from: "Green",
            to: "Red",
            peak: 4,
            nonPeak: 3
        },
        {
            from: "Red",
            to: "Red",
            peak: 3,
            nonPeak: 2
        },
        {
            from: "Red",
            to: "Green",
            peak: 3,
            nonPeak: 2
        }
    ],
    fareCaps:[
        {
            from: "Green",
            to: "Green",
            daily: 8,
            weekly: 55
        },
        {
            from: "Green",
            to: "Red",
            daily: 15,
            weekly: 90
        },
        {
            from: "Red",
            to: "Red",
            daily: 12,
            weekly: 70
        },
        {
            from: "Red",
            to: "Green",
            daily: 15,
            weekly: 90
        }
    ],
    peakHours: {
        SUNDAY: [{
            startHour:  18.00,
            endHour: 23.00
        }],
        MONDAY:[{
            startHour:  8.00,
            endHour: 10.00
        },
        {
            startHour:  16.30,
            endHour: 19.00
        }],
        TUESDAY:[{
            startHour:  8.00,
            endHour: 10.00
        },
       {
            startHour:  16.30,
            endHour: 19.00
        }],
        WEDNESDAY:[{
            startHour:  8.00,
            endHour: 10.00
        },
        {
            startHour:  16.30,
            endHour: 19.00
        }],
        THURSDAY:[{
            startHour:  8.00,
            endHour: 10.00
        },
        {
            startHour:  16.30,
            endHour: 19.00
        }],
        FRIDAY:[{
            startHour:  8.00,
            endHour: 10.00
        },
        {
            startHour:  16.30,
            endHour: 19.00
        }],
        SATURDAY:[{
            startHour:  10.00,
            endHour: 14.00
        },
        {
            startHour:  18.00,
            endHour: 23.00
        }
    ]
    }
}

export default rules;