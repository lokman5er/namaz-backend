//@ts-ignore
const serverUrl: string = "https://namaz-backend.herokuapp.com";
// edit these for local testing

// import { stringify } from 'querystring';

/**
 * Specifies the number of minutes in which a new day is simulated.
 * If set to 5, for instance, a new day is simulated every 5 minutes.
 * @type {number}
 * @default 60
 */
const intervalMinutes: number = 60;

/**
 * Specifies the interval (in minutes) to adjust the prayer times for testing purposes.
 * When set, the prayer times will be adjusted based on this interval.
 * For example, if set to 5, and the website is accessed at 1:00, the `imsak` prayer time will be set to 1:01, `gunes` to 1:06, and so on.
 * If not set or null, the actual prayer times from the data source will be used.
 *
 * @type {?number}
 * @default null
 */
let testInterval: number | null = null;

/**
 * Specifies the interval (in milliseconds) after which the language should change.
 * For example, if set to 30, the language will change every 30 seconds.
 *
 * @type {number}
 * @default 30
 */
const secondsToChangeLanguage: number = 30;

let now = new Date();

let todaysAnnouncement: { [x: string]: string };
let todayIsAnAnnouncement: boolean;

//HTML-Elements
const hoursHTML: HTMLElement = document.querySelector(".l-3-1") as HTMLElement;
const minutesHTML: HTMLElement = document.querySelector(
    ".l-3-3"
) as HTMLElement;

const countdownHour: HTMLElement = document.querySelector(
    ".countdown-hour"
) as HTMLElement;
const countdownMinute: HTMLElement = document.querySelector(
    ".countdown-minute"
) as HTMLElement;

const infoTitle: HTMLElement = document.querySelector(".l-4-1 ") as HTMLElement;
const infoText: HTMLElement = document.querySelector(".l-4-2") as HTMLElement;
const infoSource: HTMLElement = document.querySelector(".l-4-3") as HTMLElement;

// MODAL SECTION
const fridayModal: HTMLDialogElement = document.querySelector(
    "#fridayModal"
) as HTMLDialogElement;
const fridayModalContent: HTMLElement = document.querySelector(
    "#fridayModalContent"
) as HTMLElement;
const fridayModalTitle: HTMLElement = document.querySelector(
    "#fridayModalTitle"
) as HTMLElement;

/**
 * Opens the Friday modal.
 * @returns {void}
 */
(document.getElementById("openBtn") as HTMLElement).addEventListener(
    "click",
    () => {
        showFridayModal();
    }
);

(document.getElementById("closeBtn") as HTMLElement).addEventListener(
    "click",
    () => {
        closeFridayModal();
    }
);

function showFridayModal(): void {
    const fridayTitle: string = "Cuma";
    const fridayText: string = "Cuma günüdür. Cuma namazı kılınacak.";

    fridayModalTitle.innerHTML = fridayTitle;
    fridayModalContent.innerHTML = fridayText;

    fridayModal.showModal();
    //add css class
    fridayModal.classList.remove("dialog-fade-out");
    fridayModal.classList.add("dialog-fade-in");
}
/**
 * Closes the Friday modal.
 * @returns {void}
 */
function closeFridayModal(): void {
    fridayModal.classList.remove("dialog-fade-in");
    fridayModal.classList.add("dialog-fade-out");
    setTimeout(() => {
        // let the animation finish
        fridayModal.close();
    }, 2000);
}
// END MODAL SECTION

const dateNormal: HTMLElement = document.querySelector(
    ".dateNormal"
) as HTMLElement;
const monthNormal: HTMLElement = document.querySelector(
    ".monthNormal"
) as HTMLElement;
const yearNormal: HTMLElement = document.querySelector(
    ".yearNormal"
) as HTMLElement;

const dateHicri: HTMLElement = document.querySelector(
    ".dateHicri"
) as HTMLElement;
const monthHicri: HTMLElement = document.querySelector(
    ".monthHicri"
) as HTMLElement;
const yearHicri: HTMLElement = document.querySelector(
    ".yearHicri"
) as HTMLElement;

const point1: HTMLElement = document.querySelector("#p1") as HTMLElement;

const point2: HTMLElement = document.querySelector("#p2") as HTMLElement;

/**
 * Represents an array of moon elements.
 * @type {HTMLElement[]}
 */
const moonElements: HTMLElement[] = [
    document.querySelector(".moon1") as HTMLElement,
    document.querySelector(".moon2") as HTMLElement,
    document.querySelector(".moon3") as HTMLElement,
    document.querySelector(".moon4") as HTMLElement,
    document.querySelector(".moon5") as HTMLElement,
];

const timeLeft: HTMLElement = document.querySelector(
    ".timeLeft"
) as HTMLElement;
const countdownText: HTMLElement = document.querySelector(
    ".timeLeft-before"
) as HTMLElement;
const timeLeftAfter: HTMLElement = document.querySelector(
    ".timeLeft-after"
) as HTMLElement;

const importantDate1: HTMLElement = document.querySelector(
    "#box1"
) as HTMLElement;

const importantDate1Text: HTMLElement = document.querySelector(
    ".l-6-2-2"
) as HTMLElement;
const importantDate2Text: HTMLElement = document.querySelector(
    ".l-6-4-2"
) as HTMLElement;

const importantDate1Day: HTMLElement = document.querySelector(
    "#importantDate1Day"
) as HTMLElement;
const importantDate2Day: HTMLElement = document.querySelector(
    "#importantDate2Day"
) as HTMLElement;

const importantDate1Month: HTMLElement = document.querySelector(
    "#importantDate1Month"
) as HTMLElement;
const importantDate2Month: HTMLElement = document.querySelector(
    "#importantDate2Month"
) as HTMLElement;

const importantDate1Year: HTMLElement = document.querySelector(
    "#importantDate1Year"
) as HTMLElement;
const importantDate2Year: HTMLElement = document.querySelector(
    "#importantDate2Year"
) as HTMLElement;

const countdownContainer: HTMLElement = document.querySelector(
    ".timeLeft"
) as HTMLElement;

/**
 * Returns a formatted date string in the format "YYYY-MM-DDT00:00:00.000Z".
 * @param date - The date object to be formatted.
 * @returns The formatted date string.
 */
function getDateString(date: Date) {
    let year: string = date.getFullYear().toString();
    let month: string = (date.getMonth() + 1).toString().padStart(2, "0");
    let day: string = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00.000Z`;
}

/**
 * Removes the time component from a given date.
 * @param date - The date to remove the time from.
 * @returns A new Date object with the time set to 00:00:00.
 */
function withoutTime(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

const url = window.location.search;
const urlParams = new URLSearchParams(url);
let urlPara = urlParams.get("urlPara");
urlPara = urlPara === "11023" ? "muenster" : urlPara;

let initialRun = true;

if (infoText != null) {
    infoText.innerHTML = "";
}

const infobox = [infoTitle, infoText, infoSource];

/**
 * Represents a verse interface.
 */
type VerseInterface = {
    [key: string]: string | number;
    /**
     * The type of the verse.
     */
    type: number;
    /**
     * The Turkish translation of the verse.
     */
    tr: string;
    /**
     * The Arabic text of the verse.
     */
    ar: string;
    /**
     * The German translation of the verse.
     */
    de: string;
    /**
     * The source of the verse.
     */
    source: string;
};

let todaysKnowledge: VerseInterface;
// this variable is updated but not used
// let todaysKnowledgeArray:VerseInterface[];
let todaysKnowledgeSourceArabic: string;

type LangKey = "tr" | "ar" | "de";
/**
 * Array of language keys.
 * @type {LangKey[]}
 */
const languageKeys: LangKey[] = ["tr", "ar", "de"];

/**
 * Fetches verses or hadiths from "versesAndHadiths.json" and updates the UI with the retrieved data.
 */
async function getVersesOrHadiths() {
    fetch("versesAndHadiths.json")
        .then(async (response) => response.json() as Promise<VerseInterface[]>)
        .then(async (json) => {
            // see variable init
            // todaysKnowledgeArray = json;
            todaysKnowledge = json[now.getDate() - 1];

            const currentLangKey: LangKey = languageKeys[prayerLng];
            const abc: number = todaysKnowledge["type"];

            infoTitle.innerHTML = infoTitleLanguages[abc][currentLangKey];
            infoText.innerHTML = todaysKnowledge[currentLangKey];

            if (todaysKnowledge.source) {
                const abc = todaysKnowledge["source"];
                if (abc !== null) {
                    const sourceNumbers: number[] = abc
                        .match(/\d+/g)
                        ?.map(Number) as number[];
                    todaysKnowledgeSourceArabic = `[${convertToArabic(sourceNumbers[0])}:${convertToArabic(sourceNumbers[1])}]`;
                }
            }

            if (infoSource !== null) {
                infoSource.innerHTML =
                    currentLangKey === "ar"
                        ? todaysKnowledgeSourceArabic
                        : todaysKnowledge["source"];
                autoSizeText();
            }
        });
}

let announcements: string | any[] = [];

/**
 * Retrieves all announcements from the server.
 * @returns {Promise<void>} A promise that resolves when the announcements are fetched and updated.
 */
async function getAllAnnouncements() {
    fetch(`${serverUrl}/api/getAllAnnouncements?urlPara=${urlPara}`)
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch announcements");
            }
            return res.json();
        })
        .then((json) => {
            announcements = json["result"];
        })
        .catch((error) => {
            console.log("Error fetching announcements:", error);
        })
        .finally(() => {
            updateInfobox();
        });
}
/**
 * converts number into 2 char string
 * @param number number to format
 * @returns number as string with 2 chars
 */
function formatTime(number: number): string {
    return number < 10 ? "0" + number : number.toString();
}

/**
 * Retrieves the current prayer based on the current time and the prayer times for the day.
 */
function getCurrentPrayer() {
    const currentTime: string =
        formatTime(now.getHours()) + ":" + formatTime(now.getMinutes());

    for (let i = 0; i < todaysPrayerTimes.length; i++) {
        if (
            currentTime < todaysPrayerTimes[i] ||
            i === todaysPrayerTimes.length - 1
        ) {
            determineNextPrayer(currentTime, i);
            break;
        }
    }
}

/**
 * Determines the next prayer based on the current time and index.
 * @param {string | number} currentTime - The current time.
 * @param {number} index - The index of the current prayer time.
 */
function determineNextPrayer(currentTime: string | number, index: number) {
    if (index === todaysPrayerTimes.length - 1) {
        if (currentTime > todaysPrayerTimes[index]) {
            animateSvg(5);
            nextPrayer = 0;
        } else {
            animateSvg(4);
            nextPrayer = 5;
        }
    } else {
        animateSvg(index === 0 ? 5 : index - 1);
        nextPrayer = index;
    }
}

/**
 * Updates the countdown display with the time difference between the given start and end times.
 * @param startTime - The start time in the format "HH:MM".
 * @param endTime - The end time in the format "HH:MM".
 */
function updateCountdown(startTime: string, endTime: string) {
    const start = new Date("1970-01-01 " + startTime + " UTC").getTime() / 1000;
    const end = new Date("1970-01-01 " + endTime + " UTC").getTime() / 1000;
    let difference = end - start;
    if (difference < 0) {
        difference += 24 * 3600;
    }
    let hours: number = Math.floor(difference / 3600);
    let minutes: number = Math.floor((difference % 3600) / 60);

    let hours_string: string = formatTime(hours);
    let minutes_string: string = formatTime(minutes);

    countdownHour.innerText = hours_string;
    countdownMinute.innerText = minutes_string;
}

// needed to start in exact second
setTimeout(
    function () {
        runEveryMinute();
    },
    60000 - now.getMilliseconds() - now.getSeconds() * 1000
);

const interval = 60;
let adjustedInterval = interval;
let expectedCycleTime = 0;

let timeNow: string;
let hours: string;
let minutes: string;

/**
 * Runs a few functions every minute to update the UI.
 */
function runEveryMinute() {
    const now2 = Date.now();

    const hours_number: number = Number(hours);

    updateClock();

    checkIfNextPrayer();

    if (
        nextPrayer === 0 &&
        hours_number > parseInt(todaysPrayerTimes[nextPrayer].substring(0, 2))
    ) {
        let endTime2 = monthlyData[monthlyDataPointer + 1]["fajr"];
        updateCountdown(timeNow, endTime2);
    } else {
        updateCountdown(timeNow, todaysPrayerTimes[nextPrayer]);
    }

    if (expectedCycleTime === 0) {
        expectedCycleTime = now2 + interval;
    } else {
        adjustedInterval = interval - (now2 - expectedCycleTime);
        expectedCycleTime += interval;
    }

    // function calls itself after delay of adjustedInterval
    setTimeout(function () {
        runEveryMinute();
    }, adjustedInterval);
}

//function to show important dates
let importantDates: EventData[];

/**
 * Updates the clock by retrieving the current time and updating the HTML elements displaying the hours and minutes.
 * If the intervalMinutes is set to 60 and the time is midnight (00:00), the runOnNewDay function is called.
 * If the minutes are divisible by the intervalMinutes, the runOnNewDay function is called.
 */
function updateClock() {
    now = new Date();

    hours = formatTime(now.getHours());

    minutes = formatTime(now.getMinutes());
    let minutes_number: number = Number(minutes);

    if (hoursHTML !== null) {
        hoursHTML.innerHTML = hours;
    }
    if (minutesHTML !== null) {
        minutesHTML.innerHTML = minutes;
    }

    timeNow = `${hours}:${minutes}`;

    if (intervalMinutes === 60 && hours === "00" && minutes === "00") {
        runOnNewDay();
    } else if (minutes_number % intervalMinutes === 0) {
        runOnNewDay();
    }
}

/**
 * Runs the necessary tasks when a new day starts.
 * - Resets the font size for important dates in different languages.
 * - Updates the current date and time.
 * - Retrieves all announcements.
 * - Retrieves the next important date.
 * - Updates the prayer times.
 * - Fetches monthly data after a delay.
 * @returns {Promise<void>} A promise that resolves when all tasks are completed.
 */
async function runOnNewDay() {
    fontSizeImportantDates.tr = "n";
    fontSizeImportantDates.ar = "n";
    fontSizeImportantDates.de = "n";
    now = new Date();
    initialRun = false;
    getAllAnnouncements();
    await getNextImportantDate(importantDates);
    updateTimes();

    setTimeout(async () => {
        await fetchMonthlyData();
        // todo: hier varianz berechnen, damit nicht alle moscheen gleichzeitig ziehen
    }, 100);
}

/**
 * Converts a number to its Arabic representation.
 * @param number - The number to be converted.
 * @returns The Arabic representation of the number.
 */
function convertToArabic(number: number) {
    const arabicNumbers: string[] = [
        "٠",
        "١",
        "٢",
        "٣",
        "٤",
        "٥",
        "٦",
        "٧",
        "٨",
        "٩",
    ];
    let arabicNum: string = "";
    const number_string: string = number.toString();
    for (let i = 0; i < number_string.length; i++) {
        arabicNum += arabicNumbers[parseInt(number_string[i])];
    }
    return arabicNum;
}

/**
 * Represents the directions of the moon svgs.
 * @type {string[]}
 */
const moonDirection = [
    "dolunay",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d65",
    "d7",
    "sondordun",
    "sd1",
    "sd2",
    "sd3",
    "sd4",
    "sd5",
    "sd6",
    "yeniAy",
    "r1",
    "r2",
    "r3",
    "r4",
    "r45",
    "r5",
    "ilkdordun",
    "i1",
    "i2",
    "i3",
    "i4",
    "i5",
    "i6",
    "i7",
];

// ictima und ruyet beide mit yeniAy ersetzen

/**
 * Updates the SVG images of the moon elements based on the current moon shape.
 */
function updateMoonSvgs() {
    let moonUrlToday = monthlyData[monthlyDataPointer]["shapeMoon"];

    const moonIndex3 = moonDirection.indexOf(moonUrlToday);

    if (moonUrlToday === "ictima" || moonUrlToday === "ruyet") {
        moonUrlToday = "yeniAy";
    }

    moonElements[2].setAttribute("src", `images/moons/${moonUrlToday}.svg`);

    const moonIndex2 =
        (moonIndex3 - 1 + moonDirection.length) % moonDirection.length;
    moonElements[1].setAttribute(
        "src",
        `images/moons/${moonDirection[moonIndex2]}.svg`
    );

    const moonIndex1 =
        (moonIndex3 - 2 + moonDirection.length) % moonDirection.length;
    moonElements[0].setAttribute(
        "src",
        `images/moons/${moonDirection[moonIndex1]}.svg`
    );

    const moonIndex4 = (moonIndex3 + 1) % moonDirection.length;
    moonElements[3].setAttribute(
        "src",
        `images/moons/${moonDirection[moonIndex4]}.svg`
    );

    const moonIndex5 = (moonIndex3 + 2) % moonDirection.length;
    moonElements[4].setAttribute(
        "src",
        `images/moons/${moonDirection[moonIndex5]}.svg`
    );
}

let todaysPrayerTimes: string[] = [];
let isRamadan = false;
let hijriRaw: string[];

/**
 * Updates the prayer times and displays them on the frontend.
 */
function updateTimes() {
    //this is for fetching the prayer times
    isRamadan = false;
    yearHicri.style.display = "visible";

    let day = formatTime(now.getDate());
    let month = formatTime(now.getMonth() + 1);
    let year = now.getFullYear() + "";
    let targetDate = `${day}.${month}.${year}`;
    monthlyDataPointer = monthlyData.findIndex(
        (element: { gregorianDateShort: string }) =>
            element.gregorianDateShort === targetDate
    );

    let imsakRaw = monthlyData[monthlyDataPointer]["fajr"];
    let gunesRaw = monthlyData[monthlyDataPointer]["sunrise"];
    let ogleRaw = monthlyData[monthlyDataPointer]["dhuhr"];
    let ikindiRaw = monthlyData[monthlyDataPointer]["asr"];
    let aksamRaw = monthlyData[monthlyDataPointer]["maghrib"];
    let yatsiRaw = monthlyData[monthlyDataPointer]["isha"];

    if (testInterval !== null) {
        imsakRaw = increaseTimeByInterval(1);
        gunesRaw = increaseTimeByInterval(1 * testInterval + 1);
        ogleRaw = increaseTimeByInterval(2 * testInterval + 1);
        ikindiRaw = increaseTimeByInterval(3 * testInterval + 1);
        aksamRaw = increaseTimeByInterval(4 * testInterval + 1);
        yatsiRaw = increaseTimeByInterval(5 * testInterval + 1);
    }

    todaysPrayerTimes = [];
    todaysPrayerTimes.push(
        imsakRaw,
        gunesRaw,
        ogleRaw,
        ikindiRaw,
        aksamRaw,
        yatsiRaw
    );

    checkIfAllMoonImagesExist().then((result) => {
        if (result) {
            updateMoonSvgs();
        }
    });

    updateTimeSvg(imsakSVG, imsakRaw);
    updateTimeSvg(gunesSVG, gunesRaw);
    updateTimeSvg(ogleSVG, ogleRaw);
    updateTimeSvg(ikindiSVG, ikindiRaw);
    updateTimeSvg(aksamSVG, aksamRaw);
    updateTimeSvg(yatsiSVG, yatsiRaw);

    dateNormal.innerText = day;
    monthNormal.innerHTML = month;
    yearNormal.innerHTML = year;

    hijriRaw = monthlyData[monthlyDataPointer]["hijriDate"].split(".");
    const date: number = parseInt(hijriRaw[0]);
    hijriRaw.push(convertToArabic(date));

    if (hijriRaw[1] === "9") {
        isRamadan = true;
        point1.style.display = "none";

        yearHicri.style.display = "none";
        dateHicri.innerHTML = "Ramazan";
        monthHicri.innerHTML = hijriRaw[0];
    } else {
        point1.style.display = "block";
        dateHicri.innerHTML = formatTime(parseInt(hijriRaw[0]));
        monthHicri.innerHTML = formatTime(parseInt(hijriRaw[1]));
        yearHicri.innerHTML = hijriRaw[2];
    }
}

// only needed for local testing
/**
 * Increases the current time by the specified number of minutes.
 *
 * @param minutesToAdd - The number of minutes to add to the current time.
 * @returns The formatted time after adding the specified minutes.
 */
function increaseTimeByInterval(minutesToAdd: number) {
    let date = new Date();
    date.setTime(date.getTime() + minutesToAdd * 60 * 1000);
    return formatTime(date.getHours()) + ":" + formatTime(date.getMinutes());
}

/**
 * Checks if a file exists and is an SVG.
 * @param fullUrl - The full URL of the file to check.
 * @returns A boolean indicating whether the file exists and is an SVG.
 */
async function checkIfFileExistsAndIsSvg(fullUrl: string) {
    try {
        const response = await fetch(fullUrl);
        // first check if it is actually a file
        if (!response.ok) {
            //TODO some kind of notification service
            throw new Error(`URL not found: ${fullUrl}`);
        }
        const svgText = await response.text();
        // then check if it is a valid svg
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");

        if (!xmlDoc.getElementsByTagName("svg").length) {
            throw new Error(`URL is not a valid SVG: ${url}`);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Checks if all moon images exist.
 * @returns A promise that resolves to a boolean indicating whether all moon images exist.
 */
async function checkIfAllMoonImagesExist() {
    const baseURL = "images/moons/";
    const promise = moonDirection.map(async (file) => {
        const fullUrl = `${baseURL}${file}.svg`;
        const fileIsValid = await checkIfFileExistsAndIsSvg(fullUrl);
        if (!fileIsValid) {
            //TODO some kind of notification service
            console.log(`file ${fullUrl} is not valid`);
        }
        return fileIsValid;
    });

    const results = await Promise.all(promise);
    return results.every(Boolean);
}

/**
 * Updates the SVG element with the given time string.
 *
 * @param el - The SVG element to update.
 * @param raw - The raw time string.
 */
function updateTimeSvg(el: HTMLElement, raw: string) {
    el.querySelector(".hour1")!.innerHTML = raw.substring(0, 1);
    el.querySelector(".hour2")!.innerHTML = raw.substring(1, 2);
    el.querySelector(".minute1")!.innerHTML = raw.substring(3, 4);
    el.querySelector(".minute2")!.innerHTML = raw.substring(4, 5);
}

/**
 * Represents a mapping of language codes to countdown text.
 */
type CountdownTextInterface = {
    [key: string]: string;
    tr: string;
    de: string;
    ar: string;
};

/**
 * An array of countdown text objects.
 * Each object contains translations for different languages.
 */
const countdownTextArr: CountdownTextInterface[] = [
    {
        tr: "İMSAKA KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM MORGENSG.:",
        ar: "الوقت المتبقي لصلاة الفجر",
    },
    {
        tr: "GÜNEŞE KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM SONNENA.:",
        ar: "الوقت المتبقي لشروق الشمس",
    },
    {
        tr: "ÖĞLEYE KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM MITTAGSG.:",
        ar: "الوقت المتبقي لصلاة الظهر",
    },
    {
        tr: "İKİNDİYE KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM NACHM.:",
        ar: "الوقت المتبقي لصلاة العصر",
    },
    {
        tr: "AKŞAMA KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM ABENDSG.:",
        ar: "الوقت المتبقي لصلاة المغرب",
    },
    {
        tr: "YATSIYE KALAN SÜRE:",
        de: "VERBLEIBENDE ZEIT BIS ZUM NACHTSG.:",
        ar: "الوقت المتبقي لصلاة العشاء",
    },
];

/**
 * Represents an array of countdown text interfaces for different languages.
 */
const infoTitleLanguages: CountdownTextInterface[] = [
    {
        tr: "AYET",
        ar: "آية قرآنية",
        de: "VERS",
    },
    {
        tr: "HADIS",
        ar: "حديث",
        de: "HADITH",
    },
];

/**
 * Checks if the current time matches any of the prayer times for today.
 * If a match is found, it triggers an animation and updates the next prayer index.
 */
function checkIfNextPrayer(): void {
    if (todaysPrayerTimes.indexOf(timeNow) !== -1) {
        let idx: number = todaysPrayerTimes.indexOf(timeNow);

        animateSvg(idx);
        nextPrayer = idx === 5 ? 0 : idx + 1;
    }
}

let importantDatesPointer = 0;
/**
 * Represents the data for an event.
 */
type EventData = {
    date: string;
    tr: string;
    de: string;
    ar: string;
};
/**
 * Updates the important dates by fetching data from "importantDates.json" file.
 * @returns {Promise<void>} A promise that resolves when the important dates are updated.
 */
async function updateImportantDates() {
    fetch("importantDates.json")
        .then((response) => response.json())
        .then((json: EventData[]) => {
            importantDates = json;
        })
        .then(async () => await getNextImportantDate(importantDates));
}

/**
 * Retrieves the next important date from the given array of EventData.
 * Updates the styles and content of the importantDate1 and importantDate2 elements accordingly.
 *
 * @param arr - The array of EventData.
 */
async function getNextImportantDate(arr: EventData[]) {
    importantDate1.style.backgroundColor = "#d5e7ea";
    importantDate1.style.color = "#1f4e5f";

    for (let i = 0; i < arr.length; i++) {
        let jsonYear = arr[i]["date"].slice(6, 10);
        let jsonMonth = arr[i]["date"].slice(3, 5);
        let jsonDay = arr[i]["date"].slice(0, 2);

        let jsonDate = new Date(`${jsonYear}-${jsonMonth}-${jsonDay}`);

        if (
            withoutTime(now).getTime() - withoutTime(jsonDate).getTime() ===
            0
        ) {
            importantDate1.style.backgroundColor = "#3db6c4";
            importantDate1.style.color = "white";
        }

        if (withoutTime(now).getTime() <= withoutTime(jsonDate).getTime()) {
            importantDatesPointer = i;
            importantDate1Text.innerText = arr[i]["tr"];
            importantDate2Text.innerText = arr[i + 1]["tr"];

            let importantDate1Date = arr[i]["date"];
            let importantDate2Date = arr[i + 1]["date"];

            importantDate1Day.innerText = importantDate1Date.slice(0, 2);
            importantDate1Month.innerText = importantDate1Date.slice(3, 5);
            importantDate1Year.innerText = importantDate1Date.slice(6, 10);

            importantDate2Day.innerText = importantDate2Date.slice(0, 2);
            importantDate2Month.innerText = importantDate2Date.slice(3, 5);
            importantDate2Year.innerText = importantDate2Date.slice(6, 10);

            autoSizeText();

            break;
        }
    }
}

// let activateFromTop = true;
// let deactiveFromTop = true;

/**
 * Animates the SVG based on the provided index.
 * @param idx - The index to determine which SVG to animate.
 */
function animateSvg(idx: number) {
    let el: HTMLElement;
    let elClass: string;
    let activateFromTop: boolean;
    let aVal: string;

    let dEl: HTMLElement;
    let dElClass: string;
    let deactivateFromTop: boolean;
    let dVal: string;

    switch (idx) {
        case 0:
            el = imsakSVG;
            elClass = ".imsak";
            activateFromTop = true;
            aVal = "1%";

            //following are for deactivating the active status
            dEl = yatsiSVG;
            dElClass = ".yatsi";
            deactivateFromTop = false;
            dVal = "2%";
            break;
        case 1:
            el = gunesSVG;
            elClass = ".gunes";
            activateFromTop = true;
            aVal = "18.5%";

            dEl = imsakSVG;
            dElClass = ".imsak";
            deactivateFromTop = true;
            dVal = "2%";
            break;
        case 2:
            el = ogleSVG;
            elClass = ".ogle";
            activateFromTop = true;
            aVal = "34%";

            dEl = gunesSVG;
            dElClass = ".gunes";
            deactivateFromTop = true;
            dVal = "19.5%";
            break;
        case 3:
            el = ikindiSVG;
            elClass = ".ikindi";
            activateFromTop = false;
            aVal = "33.5%";

            dEl = ogleSVG;
            dElClass = ".ogle";
            deactivateFromTop = true;
            dVal = "35%";
            break;
        case 4:
            el = aksamSVG;
            elClass = ".aksam";
            activateFromTop = false;
            aVal = "18.5%";

            dEl = ikindiSVG;
            dElClass = ".ikindi";
            deactivateFromTop = false;
            dVal = "35%";

            break;
        case 5:
            el = yatsiSVG;
            elClass = ".yatsi";
            activateFromTop = false;
            aVal = "1%";

            dEl = aksamSVG;
            dElClass = ".aksam";
            deactivateFromTop = false;
            dVal = "20%";

            break;
        default:
            return;
    }

    const s1 = el.querySelectorAll("#s1");
    const s2 = el.querySelector("#s2");
    const s3 = el.querySelector("#s3");
    const s4 = el.querySelector("#s4");

    const stop1 = el.querySelector("#stop1");
    const stop2 = el.querySelector("#stop2");

    const timeBold = el.querySelectorAll(".time");

    d3.selectAll(s1).transition().duration(1000).attr("fill", "#11b6c4");

    d3.select(s2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)");

    d3.select(s3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)");

    d3.select(s4).transition().duration(1000).attr("fill", "#0c7f82");

    d3.select(stop1).transition().duration(1000).attr("stop-color", "#11b6c4");

    d3.select(stop2).transition().duration(1000).attr("stop-color", "#0c7f82");

    d3.selectAll(timeBold)
        .transition()
        .duration(1000)
        .attr("font-weight", "600");

    const elClassElement: HTMLElement = document.querySelector(
        elClass
    ) as HTMLElement;

    elClassElement.style.width = "42.5vw";

    if (activateFromTop) {
        elClassElement.style.top = aVal;
    } else {
        elClassElement.style.bottom = aVal;
    }

    //deactive animation
    const dS1 = dEl.querySelectorAll("#s1");
    const dS2 = dEl.querySelector("#s2");
    const dS3 = dEl.querySelector("#s3");
    const dS4 = dEl.querySelector("#s4");

    const dStop1 = dEl.querySelector("#stop1");
    const dStop2 = dEl.querySelector("#stop2");

    const timeNormal = dEl.querySelectorAll(".time");

    d3.selectAll(dS1).transition().duration(1000).attr("fill", "#2c7291");

    d3.select(dS2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)");

    d3.select(dS3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)");

    d3.select(dS4).transition().duration(1000).attr("fill", "#1f5260");

    d3.select(dStop1).transition().duration(1000).attr("stop-color", "#2c7291");

    d3.select(dStop2).transition().duration(1000).attr("stop-color", "#1f5260");

    d3.selectAll(timeNormal)
        .transition()
        .duration(1000)
        .attr("font-weight", "normal");

    let dElClassElement: HTMLElement = document.querySelector(
        dElClass
    ) as HTMLElement;
    dElClassElement.style.width = "37vw";

    if (deactivateFromTop) {
        dElClassElement.style.top = dVal;
    } else {
        dElClassElement.style.bottom = dVal;
    }
}

let namazTextTr: HTMLElement[] = [];
let namazTextAr: HTMLElement[] = [];
let namazTextDe: HTMLElement[] = [];

//get the text element inside svg for prayer names
let imsakSVG: HTMLElement,
    gunesSVG: HTMLElement,
    ogleSVG: HTMLElement,
    ikindiSVG: HTMLElement,
    aksamSVG: HTMLElement,
    yatsiSVG: HTMLElement;

// look up elements and store them in previous array
document.addEventListener("DOMContentLoaded", function () {
    // array for storing information
    const svgArray = {
        ".imsak": imsakSVG,
        ".gunes": gunesSVG,
        ".ogle": ogleSVG,
        ".ikindi": ikindiSVG,
        ".aksam": aksamSVG,
        ".yatsi": yatsiSVG,
    };

    Object.entries(svgArray).forEach(([k /* _ */]) => {
        const svgElement = document.querySelector(k);

        switch (k) {
            case ".imsak":
                imsakSVG = svgElement as HTMLElement;
                break;
            case ".gunes":
                gunesSVG = svgElement as HTMLElement;
                break;
            case ".ogle":
                ogleSVG = svgElement as HTMLElement;
                break;
            case ".ikindi":
                ikindiSVG = svgElement as HTMLElement;
                break;
            case ".aksam":
                aksamSVG = svgElement as HTMLElement;
                break;
            case ".yatsi":
                yatsiSVG = svgElement as HTMLElement;
                break;
        }
    });
});

/**
 * push element into element array with null check beforehand
 *
 * @param array target array
 * @param element element which will be null checked and pushed into array
 */
async function safePush(array: Element[], element: Element | null) {
    if (element !== null) {
        array.push(element);
    }
}

/**
 * Retrieves SVG elements and updates various components.
 *
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function getSvgElements() {
    // push turkish elements into turkish array
    await safePush(namazTextTr, imsakSVG.querySelector("#tr"));
    await safePush(namazTextTr, gunesSVG.querySelector("#tr"));
    await safePush(namazTextTr, ogleSVG.querySelector("#tr"));
    await safePush(namazTextTr, ikindiSVG.querySelector("#tr"));
    await safePush(namazTextTr, aksamSVG.querySelector("#tr"));
    await safePush(namazTextTr, yatsiSVG.querySelector("#tr"));

    // push arabic elements into arabic array
    await safePush(namazTextAr, imsakSVG.querySelector("#ar"));
    await safePush(namazTextAr, gunesSVG.querySelector("#ar"));
    await safePush(namazTextAr, ogleSVG.querySelector("#ar"));
    await safePush(namazTextAr, ikindiSVG.querySelector("#ar"));
    await safePush(namazTextAr, aksamSVG.querySelector("#ar"));
    await safePush(namazTextAr, yatsiSVG.querySelector("#ar"));

    // push german elements into german array
    await safePush(namazTextDe, imsakSVG.querySelector("#de"));
    await safePush(namazTextDe, gunesSVG.querySelector("#de"));
    await safePush(namazTextDe, ogleSVG.querySelector("#de"));
    await safePush(namazTextDe, ikindiSVG.querySelector("#de"));
    await safePush(namazTextDe, aksamSVG.querySelector("#de"));
    await safePush(namazTextDe, yatsiSVG.querySelector("#de"));

    updateTimes();
    getCurrentPrayer();
    updateClock();
    updateCountdown(timeNow, todaysPrayerTimes[nextPrayer]);

    if (countdownText !== null) {
        countdownText.innerHTML = countdownTextArr[nextPrayer]["tr"];
    }
}

/**
 * Updates the infobox based on the current announcements and language settings.
 */
function updateInfobox() {
    const currentLangKey = languageKeys[prayerLng];
    const titles = {
        tr: "DUYURU",
        ar: "رسالة",
        de: "MITTEILUNG",
    };

    todayIsAnAnnouncement = false;
    infoSource.style.display = "block";

    if (announcements.length > 0) {
        const todayWithoutTime = getDateString(now);

        if (
            announcements[0]["startDate"] <= todayWithoutTime &&
            announcements[0]["endDate"] >= todayWithoutTime
        ) {
            todayIsAnAnnouncement = true;
            todaysAnnouncement = announcements[0]["text"];
            infoTitle.innerText = titles[currentLangKey];
            infoText.innerText = todaysAnnouncement[currentLangKey];
            infoSource.style.display = "none";
        } else {
            //no announcement for today
            getVersesOrHadiths();
        }
    } else {
        getVersesOrHadiths();
    }

    autoSizeText();
}

let nextPrayer: number;
/**
 * Array of HTMLElements representing the elements that need to change languages.
 */
const changeLanguages: HTMLElement[] = [
    importantDate1Text,
    importantDate2Text,
    countdownContainer,
];
const ramadanLanguages: HTMLElement[] = [dateHicri, monthHicri];

let prayerLng: number = 0;

/**
 * Changes the language of the application.
 * @param language - The language code to switch to (e.g., "ar" for Arabic, "de" for German).
 * @returns A promise that resolves once the language change is complete.
 */
async function changeLanguage(language: string) {
    if (language === "ar") {
        d3.selectAll(namazTextTr)
            .transition()
            .duration(1000)
            .attr("opacity", "0");

        d3.selectAll(namazTextAr)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1");
    } else if (language === "de") {
        d3.selectAll(namazTextAr)
            .transition()
            .duration(1000)
            .attr("opacity", "0");

        d3.selectAll(namazTextDe)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1");
    } else {
        d3.selectAll(namazTextDe)
            .transition()
            .duration(1000)
            .attr("opacity", "0");

        d3.selectAll(namazTextTr)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1");
    }

    d3.selectAll(infobox)
        .transition()
        .duration(1000)
        .style("opacity", "0")
        .transition()
        .duration(1000)
        .delay(50)
        .style("opacity", "1");

    d3.selectAll(changeLanguages)
        .transition()
        .duration(1000)
        .style("opacity", "0")
        .transition()
        .duration(1000)
        .delay(50)
        .style("opacity", "1");

    if (isRamadan) {
        d3.selectAll(ramadanLanguages)
            .transition()
            .duration(1000)
            .style("opacity", "0")
            .transition()
            .duration(1000)
            .delay(50)
            .style("opacity", "1");

        if (language === "ar") {
            d3.select(point2).transition().duration(1000).style("opacity", "0");
        } else {
            d3.select(point2)
                .transition()
                .duration(1000)
                .style("opacity", "0")
                .transition()
                .duration(1000)
                .delay(50)
                .style("opacity", "1");
        }
    }

    // skip knowledge text loading up until it is loaded (other turns only)
    if (todaysKnowledge == undefined || importantDates == undefined) {
        return;
    }

    await loadAnnouncmentAndKnowledge();

    /**
     * Loads the announcement and knowledge content.
     * @returns {Promise<void>} A promise that resolves when the content is loaded.
     */
    async function loadAnnouncmentAndKnowledge(): Promise<void> {
        const countdownObject: CountdownTextInterface =
            countdownTextArr[nextPrayer];
        countdownText.innerHTML = countdownObject[language];

        if (todayIsAnAnnouncement) {
            // todo: refactor mit const title
            infoTitle.innerHTML =
                language === "ar"
                    ? "رسالة"
                    : language === "tr"
                      ? "DUYURU"
                      : "MITTEILUNG";
            infoText.innerHTML = todaysAnnouncement[language];
        } else {
            infoTitle.innerHTML =
                infoTitleLanguages[todaysKnowledge["type"]][language];
            infoText.innerHTML = todaysKnowledge[language] as string;
        }

        importantDate1Text.innerHTML =
            language === "ar"
                ? importantDates[importantDatesPointer]["ar"]
                : language === "tr"
                  ? importantDates[importantDatesPointer]["tr"]
                  : importantDates[importantDatesPointer]["de"];
        importantDate2Text.innerHTML =
            language === "ar"
                ? importantDates[importantDatesPointer + 1]["ar"]
                : language === "tr"
                  ? importantDates[importantDatesPointer + 1]["tr"]
                  : importantDates[importantDatesPointer + 1]["de"];

        if (language === "ar") {
            importantDate1Text.style.fontFamily = "Hafs";
            importantDate2Text.style.fontFamily = "Hafs";

            infoText.style.fontFamily = "Hafs";
            infoText.setAttribute("dir", "rtl");
            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "left";
                infoSource.setAttribute("dir", "rtl");
                infoSource.innerHTML = todaysKnowledgeSourceArabic;
            }

            infoTitle.style.fontFamily = "Hafs";

            importantDate1Text.style.fontStyle = "normal";
            importantDate2Text.style.fontStyle = "normal";

            timeLeft.removeChild(timeLeftAfter);
            timeLeft.insertBefore(timeLeftAfter, countdownText);
            countdownText.style.fontFamily = "Hafs";
        } else if (language === "de") {
            importantDate1Text.style.fontFamily = "'Montserrat', sans-serif";
            importantDate2Text.style.fontFamily = "'Montserrat', sans-serif";

            infoText.style.fontFamily = "'Montserrat', sans-serif";
            infoText.setAttribute("dir", "ltr");

            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "right";
                infoSource.setAttribute("dir", "ltr");
                infoSource.innerHTML = todaysKnowledge["source"];
            }

            infoTitle.style.fontFamily = "'Montserrat', sans-serif";
            importantDate1Text.style.fontStyle = "italic";
            importantDate2Text.style.fontStyle = "italic";

            timeLeft.removeChild(countdownText);
            timeLeft.insertBefore(countdownText, timeLeftAfter);
            countdownText.style.fontFamily = "'Montserrat', sans-serif";
        }

        if (isRamadan) {
            if (language === "ar") {
                monthHicri.innerHTML = "رمضان";
                monthHicri.style.fontFamily = "Hafs";
                // dateHicri.style.fontFamily = 'Hafs'
                dateHicri.innerHTML = hijriRaw[3];

                point1.style.display = "none";
                point2.style.display = "none";
            } else if (language === "de") {
                monthHicri.innerHTML = hijriRaw[0];
                dateHicri.innerHTML = "RAMADAN";
                monthHicri.style.fontFamily = "'Montserrat', sans-serif";
                // dateHicri.style.fontFamily = "'Montserrat', sans-serif"
                point2.style.display = "block";
            } else {
                dateHicri.innerHTML = "RAMAZAN";
            }
        }

        // for resize
        if (fontSizeImportantDates[language] === "n") {
            infoText.style.fontSize = "2.5vw";
            importantDate1Text.style.fontSize = "1.5vw";
            importantDate2Text.style.fontSize = "1.5vw";
            autoSizeText();
        } else {
            infoText.style.fontSize = fontSizeInfo[language];
            importantDate1Text.style.fontSize =
                fontSizeImportantDates[language];
            importantDate2Text.style.fontSize =
                fontSizeImportantDates[language];
        }
    }
}

setInterval(() => {
    if (prayerLng === 0) {
        changeLanguage("ar");
        prayerLng++;
    } else if (prayerLng === 1) {
        changeLanguage("de");
        prayerLng++;
    } else {
        changeLanguage("tr");
        prayerLng = 0;
    }
}, secondsToChangeLanguage * 1000);

// prayerLng -> 0 : tr, 1 : ar, 2 : de

/**
 * Map of font sizes for different languages.
 */
const fontSizeInfo: FontSizeMap = {
    tr: "n",
    ar: "n",
    de: "n",
};
/**
 * Represents a map of font sizes for different languages.
 */
type FontSizeMap = {
    [key: string]: string;
    tr: string;
    ar: string;
    de: string;
};
/**
 * Map of font sizes for important dates.
 */
const fontSizeImportantDates: FontSizeMap = {
    tr: "n",
    ar: "n",
    de: "n",
};

/**
 * Automatically adjusts the font size of elements with the "resize" class
 * to fit their content within their container.
 */
function autoSizeText(): void {
    const elements: HTMLElement[] = Array.from(
        document.querySelectorAll(".resize")
    ).map((el) => el as HTMLElement);

    let fontSizeImportantDateLeft, fontSizeImportantDateRight;

    elements.forEach((el) => {
        let computedFontSize = window.getComputedStyle(el).fontSize;
        while (el.scrollHeight > el.offsetHeight) {
            computedFontSize =
                parseInt(computedFontSize.slice(0, -2)) - 1 + "px";
            el.style.fontSize = computedFontSize;
        }

        if (el.id === "importantDateTextLeft") {
            fontSizeImportantDateLeft = computedFontSize;
        } else if (el.id === "importantDateTextRight") {
            fontSizeImportantDateRight = computedFontSize;
        } else if (el.id === "infoText") {
            fontSizeInfo[languageKeys[prayerLng]] = computedFontSize;
        }
    });

    if (fontSizeImportantDateLeft && fontSizeImportantDateRight) {
        const minFontSize =
            Math.min(
                parseInt(fontSizeImportantDateLeft, 10),
                parseInt(fontSizeImportantDateRight, 10)
            ) + "px";

        if (importantDate1Text !== null) {
            importantDate1Text.style.fontSize = minFontSize;
        }
        if (importantDate2Text !== null) {
            importantDate2Text.style.fontSize = minFontSize;
        }

        fontSizeImportantDates[languageKeys[prayerLng]] = minFontSize;
    }
}

addEventListener("resize", () => {
    fontSizeImportantDates.tr = "n";
    fontSizeImportantDates.ar = "n";
    fontSizeImportantDates.de = "n";

    //todo: hier fehlt doch noch infoText???

    autoSizeText();
});

let monthlyData: any[];
let monthlyDataPointer = 0;

/**
 * Fetches monthly data from the server and performs additional operations based on the response.
 */
async function fetchMonthlyData() {
    fetch(`${serverUrl}/api/getDailyData?urlPara=${urlPara}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            return response.json();
        })
        .then(async (data) => {
            if (data.status !== 200) {
                return Promise.reject(); // Return a rejected Promise to stop executing the rest of the code in this function
            }

            monthlyData = data.data;

            if (initialRun) {
                await getSvgElements();
            }
            if (urlPara) {
                await getAllAnnouncements();
                await updateImportantDates();
            }
        })
        .catch((error) => {
            console.log(`API request failed with status code ${error}`);
        });
}

fetchMonthlyData();

//TODO werden font size von importantDates UND infoText überhaupt um Mitternacht angepasst, oder nur bei einem reload der Seite?

//TODO im arabischen wird Punkt als Vers-Trenner interpretiert, problematisch bei importantDates
