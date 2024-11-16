import { IYearMonthDate, IAdBs } from './nepali-date-helper';
declare const dateSymbol: unique symbol;
declare const daySymbol: unique symbol;
declare const yearSymbol: unique symbol;
declare const monthSymbol: unique symbol;
declare const jsDateSymbol: unique symbol;
declare const convertToBSMethod: unique symbol;
declare const convertToADMethod: unique symbol;
declare const setAdBs: unique symbol;
declare const setDayYearMonth: unique symbol;
export default class NepaliDate {
    private [jsDateSymbol];
    private [yearSymbol];
    private [dateSymbol];
    private [daySymbol];
    private [monthSymbol];
    /**
     * Default language for formatting. Set the value to 'np' for default nepali formatting.
     */
    static language: 'np' | 'en';
    /**
     * **String**
     *
     * Provide a valid Nepali date string. The current supported formats are:
     *
     * ```
     * YYYY/MM/DD
     * YYYY-MM-DD
     * YYYY MM DD
     * DD/MM/YYYY
     * DD-MM-YYYY
     * DD MM YYYY
     * ```
     *
     * Example:
     *
     * ```js
     * new NepaliDate('2051/02/01') // YYYY/MM/DD
     * new NepaliDate('2051-02-01')
     * new NepaliDate('2051 02 01')
     * new NepaliDate('01/02/2051') // DD/MM/YYYY
     * new NepaliDate('01-02-2051')
     * new NepaliDate('01 02 2051')
     * ```
     *
     * **Number**
     *
     * The number value represents the UTC timestamp that will be converted to Nepali date.
     *
     * Example:
     *
     * ```js
     * new NepaliDate(1589638162879)
     * ```
     *
     * **Date**
     *
     * Javascript Date object
     *
     * Example:
     *
     * ```js
     * new NepaliDate(new Date(2020, 10, 10))
     * ```
     *
     * **Empty constructor**
     *
     * If no values are provided, the current day date will be converted to Nepali date.
     *
     * ```js
     * new NepaliDate()
     * ```
     * @param value
     */
    constructor(value?: string | number | Date);
    /**
     * This constructor takes year, monthIndex i.e 0-11, and date.
     *
     * Example:
     *
     * ```js
     * new Date(2051, 0, 1) // Baisakh 1, 2051
     * ```
     * @param year
     * @param monthIndex
     * @param date
     */
    constructor(year: number, monthIndex: number, date: number);
    private [setDayYearMonth];
    /**
     * Returns Javascript Date converted from nepali date.
     */
    toJsDate(): Date;
    /**
     * Get Nepali date for the month
     */
    getDate(): number;
    /**
     * Get Nepali date year.
     */
    getYear(): number;
    /**
     * Get Week day index for the date.
     */
    getDay(): number;
    /**
     * Get Nepali month index.
     *
     * ```
     * Baisakh => 0
     * Jestha => 1
     * Asar => 2
     * Shrawan => 3
     * Bhadra => 4
     * Aswin => 5
     * Kartik => 6
     * Mangsir => 7
     * Poush => 8
     * Magh => 9
     * Falgun => 10
     * Chaitra => 11
     * ```
     */
    getMonth(): number;
    /**
     * Returns an object with AD and BS object implementing IYearMonthDate
     *
     * Example:
     *
     * ```js
     * {
     *     BS: {
     *         year: 2052,
     *         month: 10,
     *         date: 10,
     *         day: 0
     *     },
     *     AD: {
     *         year: 2019,
     *         month: 10,
     *         date: 10,
     *         day: 0
     *     },
     *
     * }
     * ```
     */
    getDateObject(): IAdBs;
    /**
     * Returns Nepali date fields in an object implementing IYearMonthDate
     *
     * ```js
     * {
     *     year: 2052,
     *     month: 10,
     *     date: 10,
     *     day: 0
     * }
     * ```
     */
    getBS(): IYearMonthDate;
    /**
     * Returns AD date fields in an object implementing IYearMonthDate
     *
     * ```js
     * {
     *     year: 2019,
     *     month: 10,
     *     date: 10,
     *     day: 0
     * }
     * ```
     */
    getAD(): IYearMonthDate;
    /**
     * Set date in the current date object. It can be positive or negative. Positive values within the month
     * will update the date only and more then month mill increment month and year. Negative value will deduct month and year depending on the value.
     * It is similar to javascript Date API.
     *
     * Example:
     * ```js
     * let a = new NepaliDate(2054,10,10);
     * a.setDate(11); // will make date NepaliDate(2054,10,11);
     * a.setDate(-1); // will make date NepaliDate(2054,9,29);
     * a.setDate(45); // will make date NepaliDate(2054,10,15);
     * ```
     * @param date positive or negative integer value to set date
     */
    setDate(date: number): void;
    /**
     * Set month in the current date object. It can be positive or negative. Positive values within the month
     * will update the month only and more then month mill increment month and year. Negative value will deduct month and year depending on the value.
     * It is similar to javascript Date API.
     *
     * Example:
     * ```js
     * let a = new NepaliDate(2054,10,10);
     * a.setMonth(1); // will make date NepaliDate(2054,11,10);
     * a.setMonth(-1); // will make date NepaliDate(2053,11,10);
     * a.setMonth(12); // will make date NepaliDate(2054,0,10);
     * ```
     * @param date positive or negative integer value to set month
     */
    setMonth(month: number): void;
    /**
     * Set year in the current date object. It only takes positive value i.e Nepali Year
     *
     * Example:
     * ```js
     * let a = new NepaliDate(2054,10,10);
     * a.setYear(2053); // will make date NepaliDate(2053,10,15);
     * ```
     * @param date positive integer value to set year
     */
    setYear(year: number): void;
    /**
     * Format Nepali date string based on format string.
     * ```
     * YYYY - 4 digit of year (2077)
     * YYY  - 3 digit of year (077)
     * YY   - 2 digit of year (77)
     * M    - month number (1 - 12)
     * MM   - month number with 0 padding (01 - 12)
     * MMM  - short month name (Bai, Jes, Asa, Shr, etc.)
     * MMMM - full month name (Baisakh, Jestha, Asar, ...)
     * D    - Day of Month (1, 2, ... 31, 32)
     * DD   - Day of Month with zero padding (01, 02, ...)
     * d    - Week day (0, 1, 2, 3, 4, 5, 6)
     * dd   - Week day in short format (Sun, Mon, ..)
     * ddd  - Week day in long format (Sunday, Monday, ...)
     * ```
     * Set language to 'np' for nepali format. The strings can be combined in any way to create desired format.
     * ```js
     * let a = new NepaliDate(2054,10,10);
     * a.format('YYYY/MM/DD') // '2054/11/10'
     * a.format('YYYY MM DD') // '2054 11 10'
     * a.format('YYYY') // '2054'
     * a.format('ddd DD, MMMM YYYY') // 'Sunday 10, Falgun 2054'
     * a.format('To\\day is ddd DD, MMMM YYYY') // 'Today is Sunday 10, Falgun 2054', Note: use '\\' to escape [YMDd]
     * a.format('DD/MM/YYYY', 'np') //' १०/११/२०५४'
     * a.format('dd', 'np') // 'आइतबार'
     * a.format('ddd DD, MMMM YYYY','np') // 'आइतबार १०, फाल्गुण २०५४'
     * // Set static variable to 'np' for default Nepali language
     * NepaliDate.language = 'np'
     * a.format('ddd DD, MMMM YYYY') // 'आइतबार १०, फाल्गुण २०५४'
     * ```
     * @param formatString
     * @param language en | np
     */
    format(formatString: string, language?: 'en' | 'np'): string;
    /**
     * Returns new Nepali Date from the string date format
     * Similar to calling constructor with string parameter
     * @param dateString
     */
    static parse(dateString: string): NepaliDate;
    /**
     * Returns new Nepali Date converted form current day date.
     * Similar to calling empty constructor
     */
    static now(): NepaliDate;
    /**
     * Returns new converted Nepali Date from the provided Javascript Date.
     * It is similar to passing string as constructor
     * @param date
     */
    static fromAD(date: Date): NepaliDate;
    private [convertToBSMethod];
    private [setAdBs];
    private [convertToADMethod];
    valueOf(): number;
    toString(): string;
}
export {};
