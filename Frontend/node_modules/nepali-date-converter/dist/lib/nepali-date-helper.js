"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.format = exports.convertToBS = exports.convertToAD = exports.mapDaysToDateAD = exports.findPassedDaysAD = exports.mapDaysToDate = exports.yearDaysMapping = exports.monthDaysMappings = exports.findPassedDays = exports.formatObj = exports.TOTAL_DAYS = exports.COMPLETED_DAYS = exports.EPOCH_YEAR = exports.KTM_TIMEZONE_OFFSET = exports.getYearFromIndex = exports.getYearIndex = exports.Language = void 0;
var date_config_1 = require("./date-config");
var Language;
(function (Language) {
    Language["np"] = "np";
    Language["en"] = "en";
})(Language = exports.Language || (exports.Language = {}));
/**
 * The constant storing nepali date month days mappings for each year starting from 2000 BS
 */
var yearMonthDaysMapping = Object.values(date_config_1.dateConfigMap).map(function (year) {
    return Object.values(year);
});
/**
 * Memoizing the days passed for each month in year for faster calculation
 */
var monthDaysMappings = yearMonthDaysMapping.map(function (yearMappings) {
    var daySum = 0;
    return yearMappings.map(function (monthDays) {
        var monthPassedDays = [monthDays, daySum];
        daySum += monthDays;
        return monthPassedDays;
    });
}, []);
exports.monthDaysMappings = monthDaysMappings;
/**
 * Ignore
 */
var daysPassed = 0;
/**
 * Memoizing the days passed after each year from the epoch time and the sum of days in a year
 */
var yearDaysMapping = yearMonthDaysMapping.map(function (yearMappings) {
    var daysInYear = yearMappings.reduce(function (acc, x) { return acc + x; }, 0);
    var yearDaysPassed = [daysInYear, daysPassed];
    daysPassed += daysInYear;
    return yearDaysPassed;
});
exports.yearDaysMapping = yearDaysMapping;
/**
 * Max possible Day
 */
var MAX_DAY = 33238;
if (daysPassed !== MAX_DAY) {
    throw new Error('Invalid constant initialization for Nepali Date.');
}
/**
 * Min possible Day
 */
var MIN_DAY = 1;
/**
 * @ignore
 */
function getYearIndex(year) {
    return year - exports.EPOCH_YEAR;
}
exports.getYearIndex = getYearIndex;
/**
 * @ignore
 */
function getYearFromIndex(yearIndex) {
    return yearIndex + exports.EPOCH_YEAR;
}
exports.getYearFromIndex = getYearFromIndex;
/**
 * @ignore
 */
exports.KTM_TIMEZONE_OFFSET = 20700000;
/**
 * @ignore
 */
exports.EPOCH_YEAR = 2000;
/**
 * @ignore
 */
exports.COMPLETED_DAYS = 1;
/**
 * @ignore
 */
exports.TOTAL_DAYS = 0;
/**
 * @ignore
 */
function mod(m, val) {
    while (val < 0) {
        val += m;
    }
    return val % m;
}
/**
 * Format Object
 */
exports.formatObj = {
    en: {
        day: {
            short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        month: {
            short: ['Bai', 'Jes', 'Asa', 'Shr', 'Bhd', 'Asw', 'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha'],
            long: [
                'Baisakh',
                'Jestha',
                'Asar',
                'Shrawan',
                'Bhadra',
                'Aswin',
                'Kartik',
                'Mangsir',
                'Poush',
                'Magh',
                'Falgun',
                'Chaitra',
            ],
        },
        date: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
    np: {
        day: {
            short: ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'],
            long: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'],
        },
        month: {
            short: ['बै', 'जे', 'अ', 'श्रा', 'भा', 'आ', 'का', 'मं', 'पौ', 'मा', 'फा', 'चै'],
            long: [
                'बैशाख',
                'जेठ',
                'असार',
                'श्रावण',
                'भाद्र',
                'आश्विन',
                'कार्तिक',
                'मंसिर',
                'पौष',
                'माघ',
                'फाल्गुण',
                'चैत्र',
            ],
        },
        date: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    },
};
/**
 * Epoch in english date
 */
var beginEnglish = {
    year: 1943,
    month: 3,
    date: 13,
    day: 3,
};
/**
 * `findPassedDays` calculates the days passed from the epoch time.
 *  If the days are beyond boundary MIN_DAY and MAX_DAY throws error.
 * @param year Year between 2000-2009 of nepali date
 * @param month Month Index which can be negative or positive and can be any number but should be within range of year 2000-2090
 * @param date Date which can be negative or positive and can be any number but should be within range of year 2000-2090
 * @returns Number of days passed since epoch time from the given date,month and year.
 */
function findPassedDays(year, month, date) {
    try {
        var yearIndex = getYearIndex(year);
        var pastYearDays = yearDaysMapping[yearIndex][exports.COMPLETED_DAYS];
        var extraMonth = mod(12, month);
        var extraYear = Math.floor(month / 12);
        var pastMonthDays = yearDaysMapping[yearIndex + extraYear][exports.COMPLETED_DAYS] -
            pastYearDays +
            monthDaysMappings[yearIndex + extraYear][extraMonth][exports.COMPLETED_DAYS];
        var daysPassed_1 = pastYearDays + pastMonthDays + date;
        if (daysPassed_1 < MIN_DAY || daysPassed_1 > MAX_DAY) {
            throw new Error();
        }
        return daysPassed_1;
    }
    catch (_a) {
        throw new Error("The date doesn't fall within 2000/01/01 - 2090/12/30");
    }
}
exports.findPassedDays = findPassedDays;
/**
 * `mapDaysToDate` finds the date where the the given day lies from the epoch date
 * If the daysPassed is on the date 2000/01/01 then it will be 1. Similarly, every day adds on from then
 * If the days are beyond boundary MIN_DAY and MAX_DAY throws error.
 * @param daysPassed The number of days passed since nepali date epoch time
 * @returns date values in object implementing IYearMonthDate interface
 */
function mapDaysToDate(daysPassed) {
    if (daysPassed < MIN_DAY || daysPassed > MAX_DAY) {
        throw new Error("The epoch difference is not within the boundaries ".concat(MIN_DAY, " - ").concat(MAX_DAY));
    }
    var yearIndex = yearDaysMapping.findIndex(function (year) {
        return daysPassed > year[exports.COMPLETED_DAYS] && daysPassed <= year[exports.COMPLETED_DAYS] + year[exports.TOTAL_DAYS];
    });
    var monthRemainder = daysPassed - yearDaysMapping[yearIndex][exports.COMPLETED_DAYS];
    var monthIndex = monthDaysMappings[yearIndex].findIndex(function (month) {
        return monthRemainder > month[exports.COMPLETED_DAYS] &&
            monthRemainder <= month[exports.COMPLETED_DAYS] + month[exports.TOTAL_DAYS];
    });
    var date = monthRemainder - monthDaysMappings[yearIndex][monthIndex][exports.COMPLETED_DAYS];
    return {
        year: getYearFromIndex(yearIndex),
        month: monthIndex,
        date: date,
    };
}
exports.mapDaysToDate = mapDaysToDate;
function findPassedDaysAD(year, month, date) {
    var timeDiff = Math.abs(Date.UTC(year, month, date) - Date.UTC(beginEnglish.year, beginEnglish.month, beginEnglish.date));
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}
exports.findPassedDaysAD = findPassedDaysAD;
function mapDaysToDateAD(daysPassed) {
    var mappedDate = new Date(Date.UTC(1943, 3, 13 + daysPassed));
    return {
        year: mappedDate.getUTCFullYear(),
        month: mappedDate.getUTCMonth(),
        date: mappedDate.getUTCDate(),
        day: mappedDate.getUTCDay(),
    };
}
exports.mapDaysToDateAD = mapDaysToDateAD;
function convertToAD(bsDateObject) {
    try {
        var daysPassed_2 = findPassedDays(bsDateObject.year, bsDateObject.month, bsDateObject.date);
        var BS = mapDaysToDate(daysPassed_2);
        var AD = mapDaysToDateAD(daysPassed_2);
        return {
            AD: AD,
            BS: __assign(__assign({}, BS), { day: AD.day }),
        };
    }
    catch (_a) {
        throw new Error("The date doesn't fall within 2000/01/01 - 2090/12/30");
    }
}
exports.convertToAD = convertToAD;
function convertToBS(adDateObject) {
    try {
        var daysPassed_3 = findPassedDaysAD(adDateObject.getFullYear(), adDateObject.getMonth(), adDateObject.getDate());
        var BS = mapDaysToDate(daysPassed_3);
        var AD = mapDaysToDateAD(daysPassed_3);
        return {
            AD: AD,
            BS: __assign(__assign({}, BS), { day: AD.day }),
        };
    }
    catch (_a) {
        throw new Error("The date doesn't fall within 2000/01/01 - 2090/12/30");
    }
}
exports.convertToBS = convertToBS;
function mapLanguageNumber(dateNumber, language) {
    return dateNumber
        .split('')
        .map(function (num) { return exports.formatObj[language].date[parseInt(num, 10)]; })
        .join('');
}
function format(bsDate, stringFormat, language) {
    return stringFormat
        .replace(/((\\[MDYd])|D{1,2}|M{1,4}|Y{2,4}|d{1,3})/g, function (match, _, matchedString) {
        var _a;
        switch (match) {
            case 'D':
                return mapLanguageNumber(bsDate.date.toString(), language);
            case 'DD':
                return mapLanguageNumber(bsDate.date.toString().padStart(2, '0'), language);
            case 'M':
                return mapLanguageNumber((bsDate.month + 1).toString(), language);
            case 'MM':
                return mapLanguageNumber((bsDate.month + 1).toString().padStart(2, '0'), language);
            case 'MMM':
                return exports.formatObj[language].month.short[bsDate.month];
            case 'MMMM':
                return exports.formatObj[language].month.long[bsDate.month];
            case 'YY':
                return mapLanguageNumber(bsDate.year.toString().slice(-2), language);
            case 'YYY':
                return mapLanguageNumber(bsDate.year.toString().slice(-3), language);
            case 'YYYY':
                return mapLanguageNumber(bsDate.year.toString(), language);
            case 'd':
                return mapLanguageNumber(((_a = bsDate.day) === null || _a === void 0 ? void 0 : _a.toString()) || '0', language);
            case 'dd':
                return exports.formatObj[language].day.short[bsDate.day || 0];
            case 'ddd':
                return exports.formatObj[language].day.long[bsDate.day || 0];
            default:
                return matchedString.replace('/', '');
        }
    })
        .replace(/\\/g, '');
}
exports.format = format;
function parse(dateString) {
    var OFFICIAL_FORMAT = /(\d{4})\s*([/-]|\s+)\s*(\d{1,2})\s*([/-]|\s+)\s*(\d{1,2})/;
    var GEORGIAN_FORMAT = /(\d{1,2})\s*([/-]|\s+)\s*(\d{1,2})\s*([/-]|\s+)\s*(\d{4})/;
    var match;
    match = dateString.match(OFFICIAL_FORMAT);
    if (match !== null) {
        return {
            year: parseInt(match[1], 10),
            month: parseInt(match[3], 10) - 1,
            date: parseInt(match[5], 10),
        };
    }
    match = dateString.match(GEORGIAN_FORMAT);
    if (match !== null) {
        return {
            year: parseInt(match[5], 10),
            month: parseInt(match[3], 10) - 1,
            date: parseInt(match[1], 10),
        };
    }
    throw new Error('Invalid date format');
}
exports.parse = parse;
//# sourceMappingURL=nepali-date-helper.js.map