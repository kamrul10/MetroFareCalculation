import DateTimeUtility from "./DateTimeUtility"
import rules from './rules';
import { DailyFare, WeeklyFare } from "./types/Fare";
import { WeekDay } from "./types/WeekDay"

/**
 * @class MetroFare
 * @description This class calculates the Fare 
 * and apply a cap on daily and weekly interval
 */
export default class MetroFare {

    private travels: string[][];

    private travelCost: number;

    private weeklyFares: Array<WeeklyFare>;
    
    private dailyFares: Array<DailyFare>;
    

    constructor(props: string[][])  {
        this.travels = props;
        this.travelCost = 0;
        this.weeklyFares = []
        this.dailyFares = []
    }

    /**
     * @description this method returns wheather time is on peak or nonpeak hour
     * @param {string} travelTime 
     * @returns {boolean}
     */
    private isPeakHour(travelTime: string): boolean {
        const dayOfWeek = DateTimeUtility.getDayOfWeek(travelTime);
        const travelHour = Number(DateTimeUtility.getHour(travelTime));
        const peakHours = rules.peakHours[WeekDay[dayOfWeek]];
        const insidePeakHour = peakHours.find(peak => (travelHour >= peak.startHour && travelHour <= peak.endHour))

        return insidePeakHour ? true : false;
    }

    /**
     * @description this method returns peak fare and non peak fare for specific route
     * @param {boolean} isPeakHour 
     * @param {string} fromLine
     * @param {string} toLine  
     * @returns {number}
     */
    private getFareByRoute(isPeakHour: boolean, fromLine: string, toLine: string): number {
        const applicableFareObj = rules.fares
            .find(item => (item.from.toLowerCase() == fromLine && item.to.toLowerCase() == toLine))
        if(isPeakHour) {
            return Number(applicableFareObj?.peak)
        }
        return Number(applicableFareObj?.nonPeak)
    }

    /**
     * @description this method check available charge can be applied 
     * comparing with caps for specific route 
     * also return indexes to update daily and weekly collection
     * @param {number} travelDay 
     * @param {number} travelWeek
     * @param {number} travelYear
     * @param {string} fromLine
     * @param {string} toLine  
     * @returns {Object}
     */
    private checkFareWithCap(
        travelDay: number,
        travelWeek: number,
        travelYear: number,
        fromLine: string,
        toLine: string
    ): {remainingCharge: number, dailyFareIndex: number,weeklyFareIndex: number  } {
        const fareCapObj = rules.fareCaps
            .find(fareCap => (fareCap.from.toLowerCase() == fromLine && fareCap.to.toLowerCase() == toLine));

        const weeklyFareIndex = this.weeklyFares
            .findIndex(entry => (entry.from == fromLine && entry.to == toLine && entry.week == travelWeek && entry.year == travelYear));

       let weeklyFareObj = weeklyFareIndex == -1 ? {totalFare: 0}: this.weeklyFares[weeklyFareIndex]
    
        const dailyFareIndex = this.dailyFares
            .findIndex(entry => (entry.from == fromLine && entry.to == toLine && entry.day == travelDay && entry.year == travelYear));

        let dailyFareObj = dailyFareIndex == -1 ? {totalFare: 0}: this.dailyFares[dailyFareIndex]
        
        

        const weeklyRemainingCharge = Number(fareCapObj?.weekly) - weeklyFareObj.totalFare;
        const dailyRemainingCharge = Number(fareCapObj?.daily) - dailyFareObj.totalFare;

        //min applicable charges between daily and weekly limit as we have to consider both time interval
        const remainingCharge = Math.min(weeklyRemainingCharge, dailyRemainingCharge)
        return { remainingCharge, dailyFareIndex, weeklyFareIndex};
        
    }

    /**
     * @description this method calculate applicable fare for each travel
     * and sums up to return total fare to be applied
     * @returns {number}
     */
    public calculateFare(): number | undefined {
        try {
            this.travels.forEach(travel =>  {
                const fromLine = travel[0].trim().toLowerCase();
                const toLine = travel[1].trim().toLowerCase();
                const travelTime = travel[2].trim();
                let applicableCharge: number;

                const isPeakHour = this.isPeakHour(travelTime);
                const travelDay = DateTimeUtility.getDayOfYear(travelTime);
                const travelWeek = DateTimeUtility.getWeekOfYear(travelTime);
                const travelYear = DateTimeUtility.getYear(travelTime);
                const remainingChargeObj = this.checkFareWithCap(travelDay, travelWeek, travelYear, fromLine, toLine);
                if(remainingChargeObj.remainingCharge > 0) {
                    const fare = this.getFareByRoute(isPeakHour, fromLine, toLine);
                    if(fare < remainingChargeObj.remainingCharge ) {
                        applicableCharge = fare
                    } else {
                        applicableCharge = remainingChargeObj.remainingCharge;
                    }
                    
                    this.travelCost = this.travelCost + applicableCharge;

                    //update weekly collection
                    if(remainingChargeObj.weeklyFareIndex == -1) {
                        this.weeklyFares.push({
                            from: fromLine,
                            to: toLine,
                            week: travelWeek,
                            year: travelYear,
                            totalFare: applicableCharge
                        });
                    } else {
                        this.weeklyFares[remainingChargeObj.weeklyFareIndex].totalFare += applicableCharge;
                    }
            
                    //update daily collection
                    if(remainingChargeObj.dailyFareIndex == -1) {
                        this.dailyFares.push({
                            from: fromLine,
                            to: toLine,
                            day: travelDay,
                            year: travelYear,
                            totalFare: applicableCharge
                        });
                    } else {
                        this.dailyFares[remainingChargeObj.dailyFareIndex].totalFare +=  applicableCharge;
                    }
                } 
            })
            return this.travelCost;
        } catch(error)  {
            console.log('something wrong', error)
        }
    }
}