const serverUrl = "https://namaz-backend.herokuapp.com"

// edit these for local testing
/**
 * Specifies the number of minutes in which a new day is simulated.
 * If set to 5, for instance, a new day is simulated every 5 minutes.
 * @type {number}
 * @default 60
 */
const intervalMinutes = 60;

const secondsToChangeLanguage = 30000;

let now = new Date();

let todaysAnnouncement;
let todayIsAnAnnouncement;

//HTML-Elements
const hoursHTML = document.querySelector('.l-3-1');
const minutesHTML = document.querySelector('.l-3-3');

const countdownHour = document.querySelector('.countdown-hour');
const countdownMinute = document.querySelector('.countdown-minute');

const infoTitle = document.querySelector('.l-4-1 ');
const infoText = document.querySelector('.l-4-2');
const infoSource = document.querySelector('.l-4-3');

const dateNormal = document.querySelector('.dateNormal');
const monthNormal = document.querySelector('.monthNormal');
const yearNormal = document.querySelector('.yearNormal');

const dateHicri = document.querySelector('.dateHicri');
const monthHicri = document.querySelector('.monthHicri');
const yearHicri = document.querySelector('.yearHicri');

const point1 = document.querySelector('#p1');
const point2 = document.querySelector('#p2');

const moonElements = [
    document.querySelector('.moon1'),
    document.querySelector('.moon2'),
    document.querySelector('.moon3'),
    document.querySelector('.moon4'),
    document.querySelector('.moon5')
]

const timeLeft = document.querySelector(".timeLeft");
const countdownText = document.querySelector('.timeLeft-before')
const timeLeftAfter = document.querySelector(".timeLeft-after");


const importantDate1 = document.querySelector('#box1')

const importantDate1Text = document.querySelector('.l-6-2-2')
const importantDate2Text = document.querySelector('.l-6-4-2')

const importantDate1Day = document.querySelector('#importantDate1Day')
const importantDate2Day = document.querySelector('#importantDate2Day')

const importantDate1Month = document.querySelector('#importantDate1Month')
const importantDate2Month = document.querySelector('#importantDate2Month')

const importantDate1Year = document.querySelector('#importantDate1Year')
const importantDate2Year = document.querySelector('#importantDate2Year')

const countdownContainer = document.querySelector('.timeLeft')

function getDateString(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
}

Date.prototype.withoutTime = function () {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

const url = window.location.search;
const urlParams = new URLSearchParams(url);
let urlPara = urlParams.get('urlPara');
urlPara = urlPara === '11023' ? 'muenster' : urlPara


let initialRun = true;

infoText.innerHTML = ""

const infobox = [infoTitle, infoText, infoSource]

let todaysKnowledge;
let todaysKnowledgeArray;
let todaysKnowledgeSourceArabic;

const languageKeys = ['tr', 'ar', 'de'];

function getVersesOrHadiths() {
    fetch("versesAndHadiths.json")
        .then(response => response.json())
        .then(json => {
            todaysKnowledgeArray = json;
            todaysKnowledge = json[now.getDate() - 1];

            const currentLangKey = languageKeys[prayerLng];

            infoTitle.innerHTML = infoTitleLanguages[todaysKnowledge['type']][currentLangKey];
            infoText.innerHTML = todaysKnowledge[currentLangKey];

            const sourceNumbers = todaysKnowledge['source'].match(/\d+/g).map(Number);
            todaysKnowledgeSourceArabic = `[${convertToArabic(sourceNumbers[0])}:${convertToArabic(sourceNumbers[1])}]`;

            infoSource.innerHTML = currentLangKey === 'ar' ? todaysKnowledgeSourceArabic : todaysKnowledge['source'];

            autoSizeText();
        });
}

let announcements = [];

function getAllAnnouncements() {
    fetch(`${serverUrl}/api/getAllAnnouncements?urlPara=${urlPara}`)
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch announcements');
            }
            return res.json();
        })
        .then(json => {
            announcements = json['result'];
        })
        .catch(error => {
            console.log('Error fetching announcements:', error);
        })
        .finally(() => {
            updateInfobox();
        });
}

function updateInfobox() {
    const currentLangKey = languageKeys[prayerLng];
    const titles = {
        tr: 'DUYURU',
        ar: 'رسالة',
        de: 'MITTEILUNG'
    };

    todayIsAnAnnouncement = false;
    infoSource.style.display = 'block';

    if (announcements.length > 0) {
        const todayWithoutTime = getDateString(now);

        if (announcements[0]['startDate'] <= todayWithoutTime && announcements[0]['endDate'] >= todayWithoutTime) {
            todayIsAnAnnouncement = true;
            todaysAnnouncement = announcements[0]['text'];
            infoTitle.innerText = titles[currentLangKey];
            infoText.innerText = todaysAnnouncement[currentLangKey];
            infoSource.style.display = 'none';
        } else {
            //no announcement for today
            getVersesOrHadiths();
        }
    } else {
        getVersesOrHadiths();
    }

    autoSizeText();
}

let nextPrayer;

// function getCurrentPrayer() {
//     // Get current time
//     let currentHours = now.getHours();
//     currentHours = currentHours < 10 ? "0" + currentHours : currentHours;
//     let currentMinutes = now.getMinutes();
//     currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
//     const currentTime = currentHours + ":" + currentMinutes;
//
//     // Find the next prayer by looping through the prayer times
//
//     for (let i = 0; i < todaysPrayerTimes.length; i++) {
//
//         if (currentTime < todaysPrayerTimes[i] || i === todaysPrayerTimes.length - 1) {
//             if (i === todaysPrayerTimes.length - 1 && currentTime > todaysPrayerTimes[i]) {
//                 animateSvg(5);
//                 nextPrayer = 0;
//
//             } else if (i === todaysPrayerTimes.length - 1 && currentTime < todaysPrayerTimes[i]) {
//                 animateSvg(4);
//                 nextPrayer = 5;
//                 //error
//
//             } else {
//                 animateSvg(i === 0 ? 5 : i - 1);
//                 nextPrayer = i
//             }
//
//             break;
//         }
//     }
// }

function formatTime(number) {
    return number < 10 ? "0" + number : number.toString();
}

function getCurrentPrayer() {
    const currentTime = formatTime(now.getHours()) + ":" + formatTime(now.getMinutes());

    for (let i = 0; i < todaysPrayerTimes.length; i++) {
        if (currentTime < todaysPrayerTimes[i] || i === todaysPrayerTimes.length - 1) {
            determineNextPrayer(currentTime, i);
            break;
        }
    }
}

function determineNextPrayer(currentTime, index) {
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


function updateCountdown(startTime, endTime) {
    const start = new Date("1970-01-01 " + startTime + " UTC").getTime() / 1000;
    const end = new Date("1970-01-01 " + endTime + " UTC").getTime() / 1000;
    let difference = end - start;
    if (difference < 0) {
        difference += 24 * 3600;
    }
    let hours = Math.floor(difference / 3600);
    let minutes = Math.floor((difference % 3600) / 60);
    hours = formatTime(hours);
    minutes = formatTime(minutes);
    countdownHour.innerText = hours;
    countdownMinute.innerText = minutes;
}


// needed to start in exact second
setTimeout(function () {

    runEveryMinute();

}, (60000 - now.getMilliseconds() - now.getSeconds() * 1000))

const interval = 60000;
let adjustedInterval = interval;
let expectedCycleTime = 0;

let timeNow;
let hours;
let minutes;

function runEveryMinute() {
    const now2 = Date.now();

    updateClock();

    checkIfNextPrayer();

    if (nextPrayer === 0 && hours > parseInt(todaysPrayerTimes[nextPrayer].substring(0, 2))) {
        let endTime2 = monthlyData[monthlyDataPointer + 1]['fajr']
        updateCountdown(timeNow, endTime2)
    } else {
        updateCountdown(timeNow, todaysPrayerTimes[nextPrayer])
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
let importantDates;

function updateClock() {
    now = new Date();

    hours = formatTime(now.getHours());

    minutes = formatTime(now.getMinutes());

    hoursHTML.innerHTML = hours;
    minutesHTML.innerHTML = minutes;

    timeNow = `${hours}:${minutes}`

    if (intervalMinutes === 60 && hours === "00" && minutes === "00") {
        runOnNewDay();
    } else if (minutes % intervalMinutes === 0) {
        runOnNewDay();
    }
}


function runOnNewDay() {
    fontSizeImportantDates.tr = 'n';
    fontSizeImportantDates.ar = 'n';
    fontSizeImportantDates.de = 'n';
    now = new Date();
    initialRun = false;
    getAllAnnouncements();
    getNextImportantDate(importantDates)
    updateTimes();

    setTimeout(() => {
        fetchMonthlyData();
        // todo: hier varianz berechnen, damit nicht alle moscheen gleichzeitig ziehen
    }, 10000)
}


function convertToArabic(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let arabicNum = '';
    number = number.toString();
    for (let i = 0; i < number.length; i++) {
        arabicNum += arabicNumbers[parseInt(number[i])];
    }
    return arabicNum;
}


const moonDirection = ["dolunay", "d1", "d2", "d3", "d4", "d5", "d6", "d65", "d7", "sondordun", "sd1", "sd2", "sd3", "sd4", "sd5", "sd6", "yeniAy", "r1", "r2", "r3", "r4", "r45", "r5", "ilkdordun", "i1", "i2", "i3", "i4", "i5", "i6", "i7"];

// ictima und ruyet beide mit yeniAy ersetzen

function updateMoonSvgs() {

    let moonUrlToday = monthlyData[monthlyDataPointer]['shapeMoon'];

    const moonIndex3 = moonDirection.indexOf(moonUrlToday);

    if (moonUrlToday === "ictima" || moonUrlToday === 'ruyet') {
        moonUrlToday = 'yeniAy'
    }

    moonElements[2].setAttribute('src', `images/moons/${moonUrlToday}.svg`)

    const moonIndex2 = (moonIndex3 - 1 + moonDirection.length) % moonDirection.length;
    moonElements[1].setAttribute('src', `images/moons/${moonDirection[moonIndex2]}.svg`)

    const moonIndex1 = (moonIndex3 - 2 + moonDirection.length) % moonDirection.length;
    moonElements[0].setAttribute('src', `images/moons/${moonDirection[moonIndex1]}.svg`)

    const moonIndex4 = (moonIndex3 + 1) % moonDirection.length;
    moonElements[3].setAttribute('src', `images/moons/${moonDirection[moonIndex4]}.svg`)

    const moonIndex5 = (moonIndex3 + 2) % moonDirection.length;
    moonElements[4].setAttribute('src', `images/moons/${moonDirection[moonIndex5]}.svg`)
}

let todaysPrayerTimes = [];
let isRamadan = false;
let hijriRaw;

function updateTimes() {
    isRamadan = false;
    yearHicri.style.display = 'visible';

    let day = formatTime(now.getDate());
    let month = formatTime(now.getMonth() + 1);
    let year = now.getFullYear() + "";
    let targetDate = `${day}.${month}.${year}`;
    monthlyDataPointer = monthlyData.findIndex(element => element.gregorianDateShort === targetDate);

    let imsakRaw = monthlyData[monthlyDataPointer]['fajr'];
    let gunesRaw = monthlyData[monthlyDataPointer]['sunrise'];
    let ogleRaw = monthlyData[monthlyDataPointer]['dhuhr'];
    let ikindiRaw = monthlyData[monthlyDataPointer]['asr'];
    let aksamRaw = monthlyData[monthlyDataPointer]['maghrib'];
    let yatsiRaw = monthlyData[monthlyDataPointer]['isha'];

    // imsakRaw = '19:20';
    // gunesRaw = '19:25';
    // ogleRaw = '19:30';
    // ikindiRaw = '19:35';
    // aksamRaw = '15:33';
    // yatsiRaw = '19:22';

    todaysPrayerTimes = [];
    todaysPrayerTimes.push(imsakRaw, gunesRaw, ogleRaw, ikindiRaw, aksamRaw, yatsiRaw);

    checkIfAllMoonImagesExist().then(result => {
        if (result) {
            updateMoonSvgs();
        }
    })

    updateTimeSvg(imsakSVG, imsakRaw);
    updateTimeSvg(gunesSVG, gunesRaw);
    updateTimeSvg(ogleSVG, ogleRaw);
    updateTimeSvg(ikindiSVG, ikindiRaw);
    updateTimeSvg(aksamSVG, aksamRaw);
    updateTimeSvg(yatsiSVG, yatsiRaw);

    dateNormal.innerText = day;
    monthNormal.innerHTML = month;
    yearNormal.innerHTML = year;

    hijriRaw = monthlyData[monthlyDataPointer]['hijriDate'].split('.');
    hijriRaw.push(convertToArabic(hijriRaw[0]))
    //ramadan is true
    if (hijriRaw[1] === '9') {
        point1.style.display = 'none';

        isRamadan = true;
        yearHicri.style.display = 'none'
        dateHicri.innerHTML = 'Ramazan'
        monthHicri.innerHTML = hijriRaw[0]
    } else {
        point1.style.display = 'block';
        dateHicri.innerHTML = formatTime(parseInt(hijriRaw[0]));
        monthHicri.innerHTML = formatTime(parseInt(hijriRaw[1]));
        yearHicri.innerHTML = hijriRaw[2]
    }

}

function checkIfFileExistsAndIsSvg(fullUrl) {

    return fetch(fullUrl)
        .then(response => {

            // first check if it is actually a file
            if (!response.ok) {
                //TODO some kind of notification service
                throw new Error(`URL not found: ${fullUrl}`);
            }

            return response.text();

        })
        .then(svgText => {

            // then check if it is a valid svg
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");

            if (!xmlDoc.getElementsByTagName('svg').length) {
                throw new Error(`URL is not a valid SVG: ${url}`);
            }

            return true;

        })
        .catch(error => {
            console.error(error);
            return false;
        });
}

function checkIfAllMoonImagesExist() {
    const baseURL = 'images/moons/';
    const promise = moonDirection.map(file => {

        const fullUrl = `${baseURL}${file}.svg`;
        return checkIfFileExistsAndIsSvg(fullUrl)
            .then(fileIsValid => {
                if (!fileIsValid) {
                    //TODO some kind of notification service
                    console.log(`file ${fullUrl} is not valid`);
                }
                return fileIsValid;
            });
    });

    return Promise.all(promise)
        .then(results => results.every(Boolean));
}

function updateTimeSvg(el, raw) {
    el.querySelector('.hour1').innerHTML = raw.substring(0, 1)
    el.querySelector('.hour2').innerHTML = raw.substring(1, 2)
    el.querySelector('.minute1').innerHTML = raw.substring(3, 4)
    el.querySelector('.minute2').innerHTML = raw.substring(4, 5)
}

const countdownTextArr = [{
    tr: 'İMSAKA KALAN SÜRE:',
    de: 'VERBLEIBENDE ZEIT BIS ZUM MORGENSG.:',
    ar: 'الوقت المتبقي لصلاة الفجر',
},
    {
        tr: 'GÜNEŞE KALAN SÜRE:',
        de: 'VERBLEIBENDE ZEIT BIS ZUM SONNENA.:',
        ar: 'الوقت المتبقي لشروق الشمس',
    },
    {
        tr: 'ÖĞLEYE KALAN SÜRE:',
        de: 'VERBLEIBENDE ZEIT BIS ZUM MITTAGSG.:',
        ar: 'الوقت المتبقي لصلاة الظهر',
    },
    {
        tr: 'İKİNDİYE KALAN SÜRE:',
        de: 'VERBLEIBENDE ZEIT BIS ZUM NACHM.:',
        ar: 'الوقت المتبقي لصلاة العصر',
    },
    {
        tr: 'AKŞAMA KALAN SÜRE:',
        de: 'VERBLEIBENDE ZEIT BIS ZUM ABENDSG.:',
        ar: 'الوقت المتبقي لصلاة المغرب',
    },
    {
        tr: 'YATSIYE KALAN SÜRE:',
        de: 'VERBLEIBENDE ZEIT BIS ZUM NACHTSG.:',
        ar: 'الوقت المتبقي لصلاة العشاء',
    },
];

const infoTitleLanguages = [
    {
        "tr": "AYET",
        "ar": "آية قرآنية",
        "de": "VERS"
    },
    {
        "tr": "HADIS",
        "ar": "حديث",
        "de": "HADITH"
    }
]

function checkIfNextPrayer() {
    if (todaysPrayerTimes.indexOf(timeNow) !== -1) {
        let idx = todaysPrayerTimes.indexOf(timeNow);

        animateSvg(idx)
        nextPrayer = idx === 5 ? 0 : idx + 1
    }

}

let importantDatesPointer = 0;

function updateImportantDates() {
    fetch("importantDates.json")
        .then(response => response.json())
        .then(json => {
            importantDates = json
        })
        .then(() => getNextImportantDate(importantDates))

}

function getNextImportantDate(arr) {

    importantDate1.style.backgroundColor = '#d5e7ea'
    importantDate1.style.color = '#1f4e5f'

    for (let i = 0; i < arr.length; i++) {
        let jsonYear = arr[i]['date'].slice(6, 10);
        let jsonMonth = arr[i]['date'].slice(3, 5);
        let jsonDay = arr[i]['date'].slice(0, 2);

        let jsonDate = new Date(`${jsonYear}-${jsonMonth}-${jsonDay}`);

        if (now.withoutTime() - jsonDate.withoutTime() === 0) {
            importantDate1.style.backgroundColor = '#3db6c4'
            importantDate1.style.color = 'white'
        }

        if (now.withoutTime() <= jsonDate.withoutTime()) {
            importantDatesPointer = i
            importantDate1Text.innerText = arr[i]['tr']
            importantDate2Text.innerText = arr[i + 1]['tr']

            let importantDate1Date = arr[i]['date']
            let importantDate2Date = arr[i + 1]['date']

            importantDate1Day.innerText = importantDate1Date.slice(0, 2)
            importantDate1Month.innerText = importantDate1Date.slice(3, 5)
            importantDate1Year.innerText = importantDate1Date.slice(6, 10)

            importantDate2Day.innerText = importantDate2Date.slice(0, 2)
            importantDate2Month.innerText = importantDate2Date.slice(3, 5)
            importantDate2Year.innerText = importantDate2Date.slice(6, 10)


            autoSizeText();

            break;
        }

    }
}

activateFromTop = true;
deactiveFromTop = true;

function animateSvg(idx) {

    let el;
    let elClass;
    let activateFromTop;
    let aVal;

    let dEl;
    let dElClass;
    let deactivateFromTop;
    let dVal;

    switch (idx) {
        case 0:
            el = imsakSVG;
            elClass = '.imsak';
            activateFromTop = true;
            aVal = '1%'

            //following are for deactivating the active status
            dEl = yatsiSVG;
            dElClass = '.yatsi';
            deactivateFromTop = false;
            dVal = '2%'
            break;
        case 1:
            el = gunesSVG;
            elClass = '.gunes';
            activateFromTop = true;
            aVal = '18.5%'

            dEl = imsakSVG;
            dElClass = '.imsak';
            deactivateFromTop = true;
            dVal = '2%'
            break;
        case 2:
            el = ogleSVG;
            elClass = '.ogle';
            activateFromTop = true;
            aVal = '34%'

            dEl = gunesSVG;
            dElClass = '.gunes';
            deactivateFromTop = true;
            dVal = '19.5%'
            break;
        case 3:
            el = ikindiSVG;
            elClass = '.ikindi';
            activateFromTop = false;
            aVal = '33.5%'

            dEl = ogleSVG;
            dElClass = '.ogle';
            deactivateFromTop = true;
            dVal = '35%'
            break;
        case 4:
            el = aksamSVG;
            elClass = '.aksam';
            activateFromTop = false;
            aVal = '18.5%';

            dEl = ikindiSVG;
            dElClass = '.ikindi';
            deactivateFromTop = false;
            dVal = '35%'

            break;
        case 5:
            el = yatsiSVG;
            elClass = '.yatsi';
            activateFromTop = false;
            aVal = '1%';

            dEl = aksamSVG;
            dElClass = '.aksam';
            deactivateFromTop = false;
            dVal = '20%'

            break;
    }

    const s1 = el.querySelectorAll('#s1')
    const s2 = el.querySelector('#s2')
    const s3 = el.querySelector('#s3')
    const s4 = el.querySelector('#s4')

    const stop1 = el.querySelector('#stop1')
    const stop2 = el.querySelector('#stop2')

    const timeBold = el.querySelectorAll('.time')

    d3.selectAll(s1)
        .transition()
        .duration(1000)
        .attr("fill", "#11b6c4")

    d3.select(s2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)")

    d3.select(s3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)")

    d3.select(s4)
        .transition()
        .duration(1000)
        .attr("fill", "#0c7f82")

    d3.select(stop1)
        .transition()
        .duration(1000)
        .attr("stop-color", "#11b6c4")

    d3.select(stop2)
        .transition()
        .duration(1000)
        .attr("stop-color", "#0c7f82")

    d3.selectAll(timeBold)
        .transition()
        .duration(1000)
        .attr("font-weight", "600")

    document.querySelector(elClass).style.width = "42.5vw"
    if (activateFromTop) {
        document.querySelector(elClass).style.top = aVal

    } else {
        document.querySelector(elClass).style.bottom = aVal
    }

    //deactive animation
    const dS1 = dEl.querySelectorAll('#s1')
    const dS2 = dEl.querySelector('#s2')
    const dS3 = dEl.querySelector('#s3')
    const dS4 = dEl.querySelector('#s4')

    const dStop1 = dEl.querySelector('#stop1')
    const dStop2 = dEl.querySelector('#stop2')

    const timeNormal = dEl.querySelectorAll('.time')

    d3.selectAll(dS1)
        .transition()
        .duration(1000)
        .attr("fill", "#2c7291")

    d3.select(dS2)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient)")

    d3.select(dS3)
        .transition()
        .duration(1000)
        .attr("fill", "url(#linear-gradient-2)")

    d3.select(dS4)
        .transition()
        .duration(1000)
        .attr("fill", "#1f5260")

    d3.select(dStop1)
        .transition()
        .duration(1000)
        .attr("stop-color", "#2c7291")

    d3.select(dStop2)
        .transition()
        .duration(1000)
        .attr("stop-color", "#1f5260")

    d3.selectAll(timeNormal)
        .transition()
        .duration(1000)
        .attr("font-weight", "normal")

    document.querySelector(dElClass).style.width = "37vw"

    if (deactivateFromTop) {
        document.querySelector(dElClass).style.top = dVal

    } else {
        document.querySelector(dElClass).style.bottom = dVal
    }
}


let namazTextTr = []
let namazTextAr = []
let namazTextDe = []

//get the text element inside svg for prayer names
let imsakSVG, gunesSVG, ogleSVG, ikindiSVG, aksamSVG, yatsiSVG;

function getSvgElements() {

    setTimeout(() => {
        const imsakSvg = document.querySelector('.imsak')
        imsakSVG = imsakSvg.contentDocument;

        const gunesSvg = document.querySelector('.gunes')
        gunesSVG = gunesSvg.contentDocument;

        const ogleSvg = document.querySelector('.ogle')
        ogleSVG = ogleSvg.contentDocument;

        const ikindiSvg = document.querySelector('.ikindi')
        ikindiSVG = ikindiSvg.contentDocument;

        const aksamSvg = document.querySelector('.aksam')
        aksamSVG = aksamSvg.contentDocument;

        const yatsiSvg = document.querySelector('.yatsi')
        yatsiSVG = yatsiSvg.contentDocument;


        namazTextTr.push(
            imsakSVG.querySelector('#tr'),
            gunesSVG.querySelector('#tr'),
            ogleSVG.querySelector('#tr'),
            ikindiSVG.querySelector('#tr'),
            aksamSVG.querySelector('#tr'),
            yatsiSVG.querySelector('#tr')
        )

        namazTextAr.push(
            imsakSVG.querySelector('#ar'),
            gunesSVG.querySelector('#ar'),
            ogleSVG.querySelector('#ar'),
            ikindiSVG.querySelector('#ar'),
            aksamSVG.querySelector('#ar'),
            yatsiSVG.querySelector('#ar')
        )

        namazTextDe.push(
            imsakSVG.querySelector('#de'),
            gunesSVG.querySelector('#de'),
            ogleSVG.querySelector('#de'),
            ikindiSVG.querySelector('#de'),
            aksamSVG.querySelector('#de'),
            yatsiSVG.querySelector('#de')
        )


        updateTimes();
        getCurrentPrayer();
        updateClock();
        updateCountdown(timeNow, todaysPrayerTimes[nextPrayer])


        countdownText.innerHTML = countdownTextArr[nextPrayer]['tr']

    }, 4000)
}

const changeLanguages = [importantDate1Text, importantDate2Text, countdownContainer]
const ramadanLanguages = [dateHicri, monthHicri]

let prayerLng = 0

const changeLanguage = (language) => {
    if (language === "ar") {
        d3.selectAll(namazTextTr)
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        d3.selectAll(namazTextAr)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1")

    } else if (language === "de") {

        d3.selectAll(namazTextAr)
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        d3.selectAll(namazTextDe)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1")

    } else {
        d3.selectAll(namazTextDe)
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        d3.selectAll(namazTextTr)
            .transition()
            .duration(1000)
            .delay(1000)
            .attr("opacity", "1")
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

            d3.select(point2)
                .transition()
                .duration(1000)
                .style("opacity", "0")


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

    setTimeout(() => {
        // namazText.forEach((text, index) => {
        //     text.innerHTML = prayerNames[index][language];
        // });

        countdownText.innerHTML = countdownTextArr[nextPrayer][language]

        if (todayIsAnAnnouncement) {
            infoTitle.innerHTML = language === "ar" ? "رسالة" : language === "tr" ? "DUYURU" : "MITTEILUNG";
            infoText.innerHTML = todaysAnnouncement[language];
        } else {
            infoTitle.innerHTML = infoTitleLanguages[todaysKnowledge['type']][language]
            infoText.innerHTML = todaysKnowledge[language]
        }

        importantDate1Text.innerHTML = language === "ar" ? importantDates[importantDatesPointer]['ar'] : language === "tr" ? importantDates[importantDatesPointer]['tr'] : importantDates[importantDatesPointer]['de']
        importantDate2Text.innerHTML = language === "ar" ? importantDates[importantDatesPointer + 1]['ar'] : language === "tr" ? importantDates[importantDatesPointer + 1]['tr'] : importantDates[importantDatesPointer + 1]['de']

        if (language === "ar") {
            importantDate1Text.style.fontFamily = "Hafs"
            importantDate2Text.style.fontFamily = "Hafs"

            infoText.style.fontFamily = 'Hafs'
            infoText.setAttribute("dir", "rtl")
            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "left"
                infoSource.setAttribute("dir", "rtl")
                infoSource.innerHTML = todaysKnowledgeSourceArabic
            }

            infoTitle.style.fontFamily = 'Hafs'

            importantDate1Text.style.fontStyle = 'normal'
            importantDate2Text.style.fontStyle = 'normal'

            timeLeft.removeChild(timeLeftAfter);
            timeLeft.insertBefore(timeLeftAfter, countdownText);
            countdownText.style.fontFamily = "Hafs"


        } else if (language === "de") {
            importantDate1Text.style.fontFamily = "'Montserrat', sans-serif"
            importantDate2Text.style.fontFamily = "'Montserrat', sans-serif"

            infoText.style.fontFamily = "'Montserrat', sans-serif"
            infoText.setAttribute("dir", "ltr")

            if (!todayIsAnAnnouncement) {
                infoSource.style.textAlign = "right"
                infoSource.setAttribute("dir", "ltr")
                infoSource.innerHTML = todaysKnowledge['source']
            }

            infoTitle.style.fontFamily = "'Montserrat', sans-serif"
            importantDate1Text.style.fontStyle = 'italic'
            importantDate2Text.style.fontStyle = 'italic'


            timeLeft.removeChild(countdownText);
            timeLeft.insertBefore(countdownText, timeLeftAfter);
            countdownText.style.fontFamily = "'Montserrat', sans-serif"

        }

        if (isRamadan) {
            if (language === "ar") {
                monthHicri.innerHTML = "رمضان"
                monthHicri.style.fontFamily = 'Hafs'
                // dateHicri.style.fontFamily = 'Hafs'
                dateHicri.innerHTML = hijriRaw[3]

                point1.style.display = 'none'
                point2.style.display = 'none'
            } else if (language === "de") {
                monthHicri.innerHTML = hijriRaw[0]
                dateHicri.innerHTML = 'RAMADAN'
                monthHicri.style.fontFamily = "'Montserrat', sans-serif"
                // dateHicri.style.fontFamily = "'Montserrat', sans-serif"
                point2.style.display = 'block'

            } else {
                dateHicri.innerHTML = 'RAMAZAN'
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
            importantDate1Text.style.fontSize = fontSizeImportantDates[language];
            importantDate2Text.style.fontSize = fontSizeImportantDates[language];
        }

    }, 1000);
};

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
}, secondsToChangeLanguage);

// prayerLng -> 0 : tr, 1 : ar, 2 : de

const fontSizeInfo = {
    tr: 'n',
    ar: 'n',
    de: 'n'
};

const fontSizeImportantDates = {
    tr: 'n',
    ar: 'n',
    de: 'n'
};

function autoSizeText() {
    const elements = document.querySelectorAll('.resize');

    elements.forEach(el => {
        while (el.scrollHeight > el.offsetHeight) {
            el.style.fontSize = (parseInt(window.getComputedStyle(el).fontSize.slice(0, -2)) - 1) + 'px';
        }

        if (el.id === "infoText") {
            fontSizeInfo[prayerLng] = el.style.fontSize;
        }
    });

    const minFontSize = Math.min(
        parseInt(importantDate1Text.style.fontSize),
        parseInt(importantDate2Text.style.fontSize)
    ) + 'px';

    importantDate1Text.style.fontSize = minFontSize;
    importantDate2Text.style.fontSize = minFontSize;

    fontSizeImportantDates[prayerLng] = minFontSize;
}

addEventListener("resize", () => {

    fontSizeImportantDates.tr = 'n';
    fontSizeImportantDates.ar = 'n';
    fontSizeImportantDates.de = 'n';

    //todo: hier fehlt doch noch infoText???

    autoSizeText();
});

let monthlyData;
let monthlyDataPointer = 0;

function fetchMonthlyData() {
    fetch(`${serverUrl}/api/getDailyData?urlPara=${urlPara}`, {
        method: 'GET', headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.status !== 200) {
                return Promise.reject(); // Return a rejected Promise to stop executing the rest of the code in this function
            }
            monthlyData = data.data;
            if (initialRun) {
                getSvgElements()
            }
            if (urlPara) {
                getAllAnnouncements();
                updateImportantDates();
            }

        })
        .catch((error) => {
            console.log(`API request failed with status code ${error}`);
        })

}

fetchMonthlyData();


//todo: werden font size von importantDates UND infoText überhaupt um Mitternacht angepasst, oder nur bei einem reload der Seite?