export interface Fare {
    from: string;
    to: string;
    totalFare: number;
    year: number
}

export interface WeeklyFare extends Fare {
    week: number
}

export interface DailyFare extends Fare {
    day: number
}