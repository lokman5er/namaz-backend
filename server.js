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

mongoose.connect(
    `mongodb+srv://${MONGODB_CREDENTIALS}@namazapp.ccw7t1d.mongodb.net/?retryWrites=true&w=majority`,
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

var cors = require('cors')

var corsOptions = {
    origin: 'https://lokman5er.github.io'
}

app.use(cors(corsOptions))



app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())


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


    try {
        const user = await User.findOne({ urlPara })
        _id = user.id

        const password = await bcrypt.hash(newpassword, 12)

        await User.updateOne(
            { _id },
            {
                $set: { password }
            })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json({ status: 'error', error: 'try harder' })
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
    const urlPara = req.query.urlPara
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
    const urlPara = req.query.urlPara

    const today = new Date().toISOString().slice(0, 10) // get today's date in ISO format

    try {
        // Find all prayer times in the database that have a date greater than or equal to today's date
        const result = await DailyData.find({
            urlPara,
            date: { $gte: today }
        })

        // Get the highest date in the result
        const highestDate = result.sort((a, b) => b.date - a.date)[0]

        // Check if the highest date is within 30 days of today's date
        const thirtyDaysFromToday = new Date()
        thirtyDaysFromToday.setDate(thirtyDaysFromToday.getDate() + 30)
        if (!highestDate || highestDate.date < thirtyDaysFromToday) {
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
var myAccessToken = ''
async function fetchMonthlyData(urlPara, highestDate) {

    const optionsLogin = {
        method: 'POST',
        url: 'https://awqatsalah.diyanet.gov.tr/Auth/Login',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // email: process.env.email,
            // password: process.env.password
            email: DIYANET_MAIL,
            password: DIYANET_PW
        })
    };

    const responseLogin = await requestPromise(optionsLogin)
    loginBody = JSON.parse(responseLogin.body)
    myAccessToken = loginBody.data.accessToken
    const optionsMonthlyData = {
        method: 'GET',
        url: `https://awqatsalah.diyanet.gov.tr/api/PrayerTime/Monthly/${urlPara}`,
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${myAccessToken}`
        }
    };

    const responseMonthlyData = await requestPromise(optionsMonthlyData);
    const monthlyBody = JSON.parse(responseMonthlyData.body);
    var monthlyData = []
    monthlyBody.data.forEach(element => {
        monthlyData.push({
            urlPara: urlPara,
            date: createMongooseDate(element.gregorianDateShort),
            gregorianDateShort: element.gregorianDateShort,
            fajr: element.fajr,
            dhuhr: element.dhuhr,
            asr: element.asr,
            maghrib: element.maghrib,
            isha: element.isha,
            shapeMoon: getMoon(element.shapeMoonUrl),
            hijriDate: element.hijriDateShort
        })
    })


    // If there is no highest date (i.e., this is the first time this function is being called)
    if (!highestDate) {
        await saveData(monthlyData)
            .then(() => {
                console.log("Data saved successfully!")
            })
            .catch((error) => {
                console.log("Error saving data: ", error)
            });
    } else if (highestDate) {
        // If there is a highest date, filter the data to only include data with a date greater than the highest date
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
    var regex = /http:\/\/namazvakti\.diyanet\.gov\.tr\/images\/(.*?)\.gif/;
    var match = url.match(regex);
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
    var date = new Date(Date.UTC(year, month, day));
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

//old methode to grab prayerData
async function fetchAndSaveDailyData(urlPara, highestDate) {
    // Set the headers for the request to the Diyanet API
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    };

    // Build the URL for the request to the Diyanet API
    const url = `https://namazvakitleri.diyanet.gov.tr/de-DE/${urlPara}`;

    // Return a new Promise that resolves or rejects based on the success or failure of the request
    return new Promise((resolve, reject) => {
        // Make the request to the Diyanet API
        request(url, { headers }, (error, response, html) => {
            // If the request was successful (status code 200)
            if (!error && response.statusCode === 200) {
                // Use cheerio to parse the HTML response
                const $ = cheerio.load(html)

                // Find the table in the HTML with the prayer times
                const table = $('#tab-1 tbody tr')

                // Initialize an empty array to store the data
                const data = []

                // For each row in the table
                table.each((i, elem) => {
                    // Find the cells in the row
                    const cells = $(elem).find('td')

                    // Push an object with the data from the cells to the data array
                    data.push({
                        urlPara: urlPara,
                        date: new Date(cells.eq(0).text().split('.').reverse().join('-')),
                        imsak: cells.eq(1).text(),
                        guenes: cells.eq(2).text(),
                        oegle: cells.eq(3).text(),
                        ikindi: cells.eq(4).text(),
                        aksam: cells.eq(5).text(),
                        yatsi: cells.eq(6).text()
                    })
                })

                // If there is no highest date (i.e., this is the first time this function is being called)
                if (!highestDate) {
                    // Save all of the data to the database
                    DailyData.create(data, (error) => {
                        // If there was an error saving the data
                        if (error) {
                            // Log the error and reject the Promise
                            console.log(error)
                            reject(error)
                        } else {
                            // Otherwise, resolve the Promise
                            resolve()
                        }
                    })
                } else if (highestDate) {
                    // If there is a highest date, filter the data to only include data with a date greater than the highest date
                    const filteredData = data.map(datum => {
                        if (datum.date > highestDate.date) {
                            return datum
                        }
                    }).filter(datum => datum !== undefined)

                    // Save the filtered data to the database
                    DailyData.create(filteredData, (error) => {
                        // If there was an error saving the data
                        if (error) {
                            // Log the error and reject the Promise
                            console.log(error)
                            reject(error)
                        } else {
                            // Otherwise, resolve the Promise
                            resolve()
                        }
                    })
                }
            } else {
                // If the request was not successful, reject the Promise with the error
                reject(error)
            }
        });
    })
}

// app.post('/api/extend-token', async (req, res) => {
//     const { token } = req.body;

//     if (!token) {
//         return res.json({ status: 'error' })
//     }

//     // Check if token is expired
//     const decodedToken = jwt.decode(token, { complete: true });
//     if (decodedToken.payload.exp < Date.now() / 1000) {
//         return res.json({ status: 'expired' })
//     }

//     try {
//         // Verify the token and get the user ID
//         const { id } = jwt.verify(token, JWT_SECRET);

//         // Find the user in the database
//         const user = await User.findById(id);
//         if (!user) throw new Error('Invalid token');

//         // Generate a new token with an expiration date of 60 minutes in the future
//         const newToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '60m' });

//         // Update the user's token in the database
//         await User.findByIdAndUpdate(id, { token: newToken });

//         return res.json({ status: 'ok', data: newToken });
//     } catch (error) {
//         console.error(error);
//         return res.json({ status: 'error', error: 'Invalid token' });
//     }
// });


