import Moment from 'moment';
interface DateTime {
    getDayOfYear(datetime: string): number;
    getWeekOfYear(datetime: string): number;
    getHour(datetime: string): string;
    getDayOfWeek(datetime: string): number;
    getYear(datetime: string): number
};

class DateTimeUtility implements DateTime {
    public getDayOfYear(datetime: string): number {
        return Moment(datetime).dayOfYear()
    }

    public getDayOfWeek(datetime: string) {
        return Moment(datetime).weekday()
    }

    public getWeekOfYear(datetime: string): number {
        return Moment(datetime).week()
    }

    public getHour(datetime: string): string {
        return Moment(datetime).format('HH.MM')
    }

    public getYear(datetime: string): number {
        return Moment(datetime).year()
    }
}

export default new DateTimeUtility()

