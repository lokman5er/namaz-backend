const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const Announcement = require('./model/announcement')
const DailyData = require('./model/DailyData')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const request = require('request');
const util = require('util')

require("dotenv").config()

// const cheerio = require('cheerio');

const API_KEY = process.env.API_KEY
const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_CREDENTIALS = process.env.MONGODB
const DIYANET_MAIL = process.env.DIYANET_MAIL
const DIYANET_PW = process.env.DIYANET_PW
const PORT = process.env.PORT

const app = express()

mongoose.set('strictQuery', false);

// noinspection JSUnresolvedFunction
mongoose.connect(
    //`mongodb+srv://${MONGODB_CREDENTIALS}@namazapp.ccw7t1d.mongodb.net/?retryWrites=true&w=majority`,
    `mongodb+srv://${MONGODB_CREDENTIALS}@namazwork.3gpx1eu.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.error('FAILED TO CONNECT TO MONGODB');
            console.error(err);
        } else {
            console.log('CONNECTED TO MONGODB');
            app.listen(PORT);
        }
    }
);

const cors = require('cors');

app.use(cors())

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/duyuru', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

app.post('/api/register', async (req, res) => {
    const { username, password: plainTextPassword, urlPara, apiKey } = req.body

    if (apiKey !== API_KEY) {
        return res.json({ status: 'error', error: 'Wrong Api Key' })
    }

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({ status: 'error', error: 'Password too short.' })
    }

    if (plainTextPassword.length > 15) {
        return res.json({ status: 'error', error: 'Password too long.' })
    }

    if (!urlPara) {
        return res.json({ status: 'error', error: 'urlPara missing' })
    }

    const password = await bcrypt.hash(plainTextPassword, 12)

    try {
        const response = await User.create({
            username,
            password,
            urlPara
        })
        console.log('User created successfully: ', response);
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Username or urlPara already in use' })
        }
        throw (error)
    }

    res.json({ status: 'ok' })
})

app.post('/api/change-password', async (req, res) => {
    const { urlPara, newpassword, apiKey } = req.body

    if (apiKey !== API_KEY) {
        return res.json({ status: 'error', error: 'Wrong Api Key' })
    }

    if (!newpassword || typeof newpassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (newpassword.length < 5) {
        return res.json({ status: 'error', error: 'Password too short.' })
    }

    if (newpassword.length > 15) {
        return res.json({ status: 'error', error: 'Password too long.' })
    }


    let _id;
    try {
        const user = await User.findOne({urlPara})
        _id = user.id

        const password = await bcrypt.hash(newpassword, 12)

        await User.updateOne(
            {_id},
            {
                $set: {password}
            })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: 'try harder'})
    }

})

app.post('/api/login/', async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.json({ status: 'error', error: 'try harder' })
    }

    const user = await User.findOne({ username }).lean()

    if (!user) {
        return res.json({
            status: 'error', error:
                // 'Invalid username/password'
                'Geçersiz kullanıcı adı/parola'
        })
    }

    if (await bcrypt.compare(password, user.password)) {
        //username + password combination is successful

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            urlPara: user.urlPara
        }, JWT_SECRET, { expiresIn: '60m' });

        await User.updateOne({ username: user.username }, { $set: { token } })

        return res.json({ status: 'ok', data: token })
    }


    res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/logout', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.json({ status })
    }

    // Check if token is expired
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
        return res.json({ status: 'expired' })
    }

    // Verify the token and get the user ID
    const { id } = jwt.verify(token, JWT_SECRET);

    // Find the user in the database and delete the token field
    await User.findByIdAndUpdate(id, { $unset: { token: 1 } });


});

app.post('/api/new-an', async (req, res) => {
    const { token, startDate, endDate, text } = req.body

    if (!token || !startDate || !endDate || !text) {
        return res.json({ status: 'error' })
    }

    // Check if token is expired
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
        return res.json({ status: 'expired' })
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)
        urlPara = user.urlPara

        // Retrieve all announcements with the same 'urlPara'
        const announcements = await Announcement.find({ urlPara })

        // Check if the time period of the new announcement overlaps with any of the existing announcements
        let overlaps = false

        const ns = Date.parse(startDate) / 1000
        const ne = Date.parse(endDate) / 1000

        announcements.forEach(a => {
            if (overlaps) {
                return
            }
            const os = Date.parse(a.startDate) / 1000
            const oe = Date.parse(a.endDate) / 1000
            if ((ns <= os && ne >= os && ne <= oe) ||
                (ns <= os && ne >= oe) ||
                (ns >= os && ne <= oe) ||
                (ns >= os && ns <= oe && ne >= oe)) {
                overlaps = true
            }
        })


        if (overlaps) {
            res.json({
                status: 'error', error:
                    // 'There is already an announcement within this time period'
                    'Bu zaman aralığı içinde zaten bir duyuru mevcut.'
            })
        } else {
            // The time period of the new announcement does not overlap with any of the existing announcements
            const result = await Announcement.create({
                urlPara,
                text,
                startDate,
                endDate
            })
            console.log(result)
            res.json({ status: 'ok' })
        }


    } catch (error) {
        console.log(error)
    }





})

app.get('/api/get-All-an', async (req, res) => {
    const token = req.query.token

    if (!token) {
        return res.json({ status: 'error' })
    }

    // Check if token is expired
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
        return res.json({ status: 'expired' })
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)
        urlPara = user.urlPara

        // Find all announcements whose endDate is greater than or equal to today at midnight
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set the time to midnight
        const result = await Announcement.find({
            urlPara,
            endDate: { $gte: today }
        }).sort({ startDate: 1 })
        res.json({ result })
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/deleteAnnouncement', async (req, res) => {
    const { token, startDate } = req.body

    if (!token || !startDate) {
        return res.json({ status: 'error' })
    }

    // Check if token is expired
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
        return res.json({ status: 'expired' })
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)
        urlPara = user.urlPara

        const result = await Announcement.deleteOne({
            urlPara, startDate
        })
        res.json({ status: 'ok', message: result.message })
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/check-token', async (req, res) => {

    // Extract the token from the request query
    const token = req.query.token;

    if (!token) {
        return res.json({ status: 'error', error: 'try harder' })
    }

    // Check if token is expired
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
        return res.json({ status: 'expired' })
    }

    try {
        // Verify the token and get the user ID
        const { id } = jwt.verify(token, JWT_SECRET);
        // Find the user in the database and check if the token field is set
        const user = await User.findById(id);

        if (!user.token) {
            // If the token field is not set, the token has expired
            return res.json({ status: 'error', error: 'Token expired' });
        }

        // If the token is still valid, return a success response
        return res.json({ status: 'ok' });
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: error.message })
    }
});

app.get('/api/getAllAnnouncements', async (req, res) => {

    const username = req.query.urlPara

    const user = await User.findOne({
        username
    })

    if (!user) return res.json({ status: 'error', error: 'No user found in DB' })

    const urlPara = user.urlPara

    try {
        // Find all announcements whose endDate is greater than or equal to today at midnight
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set the time to midnight
        const result = await Announcement.find({
            urlPara,
            endDate: { $gte: today }
        }).sort({ startDate: 1 })
        res.json({ result })
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/getDailyData', async (req, res) => {
    const username = req.query.urlPara

    const user = await User.findOne({
        username
    })

    if (!user) return res.json({ status: 'error', error: 'No user found in DB' })

    const urlPara = user.urlPara

    const today = new Date().toISOString().slice(0, 10) // get today's date in ISO format

    try {
        // Find all prayer times in the database that have a date greater than or equal to today's date
        const result = await DailyData.find({
            urlPara,
            date: { $gte: today }
        }).lean()

        result.get('date')

        // Get the highest date in the result
        const highestDate = result.sort((a, b) => b.date - a.date)[0]

        // Check if the highest date is within 30 days of today's date
        const fifteenDaysFromToday = new Date()
        fifteenDaysFromToday.setDate(fifteenDaysFromToday.getDate() + 15)
        if (!highestDate || highestDate.date < fifteenDaysFromToday) {
            // The next 30 days are not in the database, so fetch the data from the API
            await fetchMonthlyData(urlPara, highestDate)
        }

        // Find all prayer times in the database that have a date greater than or equal to today's date
        const times = await DailyData.find({
            urlPara,
            date: { $gte: today }
        }).sort({ date: 1 });

        res.json({ status: 200, data: times });
    } catch (error) {
        console.log(error)
    }
})

const requestPromise = util.promisify(request)
let myAccessToken = '';

async function fetchMonthlyData(urlPara, highestDate) {

    const optionsLogin = {
        method: 'POST',
        url: 'https://awqatsalah.diyanet.gov.tr/Auth/Login',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: DIYANET_MAIL,
            password: DIYANET_PW
        })
    };

    const responseLogin = await requestPromise(optionsLogin,null)
    let loginBody = JSON.parse(responseLogin.body)
    myAccessToken = loginBody.data.accessToken
    const optionsMonthlyData = {
        method: 'GET',
        url: `https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Monthly/${urlPara}`,
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${myAccessToken}`
        }
    };

    const responseMonthlyData = await requestPromise(optionsMonthlyData,null);
    const monthlyBody = JSON.parse(responseMonthlyData.body);
    const monthlyData = [];
    monthlyBody.data.forEach(element => {
        monthlyData.push({
            urlPara: urlPara,
            date: createMongooseDate(element.gregorianDateShort),
            gregorianDateShort: element.gregorianDateShort,
            fajr: element.fajr,
            sunrise: element.sunrise,
            dhuhr: element.dhuhr,
            asr: element.asr,
            maghrib: element.maghrib,
            isha: element.isha,
            shapeMoon: getMoon(element["shapeMoonUrl"]),
            hijriDate: element["hijriDateShort"]
        })
    })

    if (!highestDate) {
        // (i.e., this is the first time this function is being called)
        await saveData(monthlyData)
            .then(() => {
                console.log("Data saved successfully!")
            })
            .catch((error) => {
                console.log("Error saving data: ", error)
            });
    } else if (highestDate) {
        // only include data with a date greater than the highest date
        const filteredData = monthlyData.map(datum => {
            if (datum.date > highestDate.date) {
                return datum
            }
        }).filter(datum => datum !== undefined)

        // Save the filtered data to the database
        await saveData(filteredData)
    }
}

function getMoon(url) {
    const regex = /http:\/\/namazvakti\.diyanet\.gov\.tr\/images\/(.*?)\.gif/;
    const match = url.match(regex);
    if (match) {
        return match[1];
    }
    return null;
}

function createMongooseDate(input) {
    const dateComponents = input.split(".");
    const day = parseInt(dateComponents[0]);
    const month = parseInt(dateComponents[1]) - 1;
    const year = parseInt(dateComponents[2]);
    const date = new Date(Date.UTC(year, month, day));
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

async function saveData(data) {
    try {
        await DailyData.create(data)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
