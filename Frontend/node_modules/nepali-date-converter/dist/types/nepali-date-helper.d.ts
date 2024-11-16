export declare enum Language {
    np = "np",
    en = "en"
}
export interface IYearMonthDate {
    year: number;
    month: number;
    date: number;
    day?: number;
}
export interface IAdBs {
    AD: IYearMonthDate;
    BS: IYearMonthDate;
}
/**
 * Memoizing the days passed for each month in year for faster calculation
 */
declare const monthDaysMappings: number[][][];
/**
 * Memoizing the days passed after each year from the epoch time and the sum of days in a year
 */
declare const yearDaysMapping: number[][];
/**
 * @ignore
 */
export declare function getYearIndex(year: number): number;
/**
 * @ignore
 */
export declare function getYearFromIndex(yearIndex: number): number;
/**
 * @ignore
 */
export declare const KTM_TIMEZONE_OFFSET = 20700000;
/**
 * @ignore
 */
export declare const EPOCH_YEAR = 2000;
/**
 * @ignore
 */
export declare const COMPLETED_DAYS = 1;
/**
 * @ignore
 */
export declare const TOTAL_DAYS = 0;
/**
 * Format Object
 */
export declare const formatObj: {
    en: {
        day: {
            short: string[];
            long: string[];
        };
        month: {
            short: string[];
            long: string[];
        };
        date: string[];
    };
    np: {
        day: {
            short: string[];
            long: string[];
        };
        month: {
            short: string[];
            long: string[];
        };
        date: string[];
    };
};
/**
 * `findPassedDays` calculates the days passed from the epoch time.
 *  If the days are beyond boundary MIN_DAY and MAX_DAY throws error.
 * @param year Year between 2000-2009 of nepali date
 * @param month Month Index which can be negative or positive and can be any number but should be within range of year 2000-2090
 * @param date Date which can be negative or positive and can be any number but should be within range of year 2000-2090
 * @returns Number of days passed since epoch time from the given date,month and year.
 */
export declare function findPassedDays(year: number, month: number, date: number): number;
export { monthDaysMappings, yearDaysMapping };
/**
 * `mapDaysToDate` finds the date where the the given day lies from the epoch date
 * If the daysPassed is on the date 2000/01/01 then it will be 1. Similarly, every day adds on from then
 * If the days are beyond boundary MIN_DAY and MAX_DAY throws error.
 * @param daysPassed The number of days passed since nepali date epoch time
 * @returns date values in object implementing IYearMonthDate interface
 */
export declare function mapDaysToDate(daysPassed: number): IYearMonthDate;
export declare function findPassedDaysAD(year: number, month: number, date: number): number;
export declare function mapDaysToDateAD(daysPassed: number): {
    year: number;
    month: number;
    date: number;
    day: number;
};
export declare function convertToAD(bsDateObject: IYearMonthDate): IAdBs;
export declare function convertToBS(adDateObject: Date): IAdBs;
export declare function format(bsDate: IYearMonthDate, stringFormat: string, language: 'en' | 'np'): string;
export declare function parse(dateString: string): IYearMonthDate;
