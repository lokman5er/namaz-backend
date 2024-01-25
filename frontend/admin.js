"use strict";
const serverUrl = "https://namaz-backend.herokuapp.com";
// Get references to the forms on the page
const loginForm = document.getElementById('log-form');
const anForm = document.getElementById('new-an');
// Get references to the input fields for the new announcement form
const startDateEl = document.getElementById('start-date');
const endDateEl = document.getElementById('end-date');
const anTr = document.getElementById('new-tr');
const anAr = document.getElementById('new-ar');
const anDe = document.getElementById('new-de');
// Get reference to the submit button for the new announcement form
const anSubmit = document.getElementById('an-submit');
// Different Views
const loginView = document.querySelector('.card');
const announcementsView = document.querySelector('.announcements');
// Get reference for popup to show error messages
const popupTitle = document.querySelector('.popup-title');
const popupText = document.querySelector('.popup-text');
const popupContainer = document.querySelector('.popup-container');
const popupButton = document.querySelector('.popup-button');
if (localStorage.getItem('token')) {
    checkToken();
}
async function checkToken() {
    const token = localStorage.getItem('token');
    const result = await sendRequest(`${serverUrl}/api/check-token?token=${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (result.status === 'ok') {
        loginView.style.display = "none";
        announcementsView.style.display = "block";
        updateTable();
    }
    else {
        localStorage.removeItem('token');
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    }
}
// Helper function to send a request to the server
async function sendRequest(url, options) {
    // Send the request to the given URL with the given options
    // and return the response as JSON
    return fetch(url, options)
        .then((res) => res.json());
}
const showPassword = document.querySelector('.fa-eye');
const hidePassword = document.querySelector('.fa-eye-slash');
showPassword.addEventListener('click', () => {
    passwordInput.type = "text";
    showPassword.style.display = "none";
    hidePassword.style.display = "inline";
});
hidePassword.addEventListener('click', () => {
    passwordInput.type = "password";
    hidePassword.style.display = "none";
    showPassword.style.display = "inline";
});
// Event listener for the login form's submit event
loginForm.addEventListener('submit', login);
// Function to handle the submission of the login form
async function login(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the values of the input fields
    const username = document.getElementById('l-username').value;
    const password = document.getElementById('l-password').value;
    // Send a POST request to the server to login
    const result = await sendRequest(`${serverUrl}/api/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    // If the request was successful, store the returned token in local storage
    // Otherwise, show an error with the error message
    if (result.status === 'ok') {
        document.getElementById('submit-login').setAttribute('disabled', true);
        loginView.style.display = "none";
        announcementsView.style.display = "block";
        localStorage.setItem('token', result.data);
        //load the right announcements data with api
        updateTable();
    }
    else {
        document.getElementById('submit-login').setAttribute('disabled', true);
        popupContainer.style.display = "flex";
        popupText.innerText = result.error;
    }
    document.getElementById('l-username').value = '';
    document.getElementById('l-password').value = '';
}
// Set the current date as the minimum value for the start and end date fields
startDateEl.valueAsDate = new Date();
endDateEl.valueAsDate = new Date();
startDateEl.setAttribute('min', startDateEl.value);
endDateEl.setAttribute('min', startDateEl.value);
// Event listener for the date field's change event
startDateEl.addEventListener('change', () => {
    // If the end date is earlier than the start date, set the end date to the start date
    if (endDateEl.value < startDateEl.value) {
        endDateEl.valueAsDate = startDateEl.valueAsDate;
    }
    // Set the minimum value for the end date field to the start date
    endDateEl.setAttribute('min', startDateEl.value);
});
// Event listener for the new announcement form's submit event
anForm.addEventListener('submit', newAnnouncement);
var newAnSuccessfull = false;
// Function to handle the submission of the new announcement form
async function newAnnouncement(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    if (!localStorage.getItem('token')) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    // Get the values of the input fields
    const anTr1 = anTr.value;
    const anAr1 = anAr.value;
    const anDe1 = anDe.value;
    const startDate = startDateEl.value;
    const endDate = endDateEl.value;
    // Send a POST request to the server to create a new announcement
    const result = await sendRequest(`${serverUrl}/api/new-an`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: {
                tr: anTr1,
                ar: anAr1,
                de: anDe1
            },
            startDate,
            endDate,
            token: localStorage.getItem('token')
        })
    });
    // If the request was successful, show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === 'ok') {
        newAnSuccessfull = true;
        popupContainer.style.display = "flex";
        popupTitle.innerText = "BAŞARI";
        popupText.innerText = "Duyuru başarıyla eklendi.";
        anTr.value = "";
        anAr.value = "";
        anDe.value = "";
        anSubmit.setAttribute('disabled', true);
        startDateEl.valueAsDate = new Date();
        endDateEl.valueAsDate = new Date();
        startDateEl.setAttribute('min', startDateEl.value);
        endDateEl.setAttribute('min', startDateEl.value);
    }
    else if (result.status === 'expired') {
        localStorage.removeItem('token');
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    }
    else {
        popupTitle.innerText = "HATA";
        popupContainer.style.display = "flex";
        popupContainer.style.position = "absolute";
        popupText.innerText = result.error;
    }
    updateTable();
}
// Event listener for the window's resize event
window.addEventListener('resize', () => {
    // If the window width is greater than 830 pixels
    if (window.innerWidth > 830) {
        // Get the elements with the class 'an-mid-left' and 'an-mid-right'
        const newAn = document.querySelector('.an-mid-left');
        const anList = document.querySelector('.an-mid-right');
        // Remove the 'display' CSS attribute from both elements
        newAn.style.display = '';
        anList.style.display = '';
        title.innerText = "DUYURULAR";
    }
    else {
        buttonNewAn.removeAttribute("disabled");
        buttonAns.setAttribute("disabled", "");
    }
});
function updateSubmitButtonLogin() {
    //Get the values of the input fields;
    const username = document.getElementById('l-username').value;
    const password = document.getElementById('l-password').value;
    // Get the submit button
    const submitButtonLogin = document.getElementById('submit-login');
    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (username && password) {
        submitButtonLogin.removeAttribute('disabled');
    }
    else {
        submitButtonLogin.setAttribute('disabled', true);
    }
}
const usernameInput = document.getElementById('l-username');
const passwordInput = document.getElementById('l-password');
usernameInput.addEventListener('input', updateSubmitButtonLogin);
passwordInput.addEventListener('input', updateSubmitButtonLogin);
//for new announcement
function updateSubmitButton() {
    // Get the values of the input fields
    const anTr = document.getElementById('new-tr').value;
    const anAr = document.getElementById('new-ar').value;
    const anDe = document.getElementById('new-de').value;
    // Get the submit button
    const submitButton = document.getElementById('an-submit');
    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (anTr && anAr && anDe) {
        submitButton.removeAttribute('disabled');
    }
    else {
        submitButton.setAttribute('disabled', true);
    }
}
const anTrInput = document.getElementById('new-tr');
const anArInput = document.getElementById('new-ar');
const anDeInput = document.getElementById('new-de');
anTrInput.addEventListener('input', updateSubmitButton);
anArInput.addEventListener('input', updateSubmitButton);
anDeInput.addEventListener('input', updateSubmitButton);
const buttonAns = document.querySelector('.b-1');
const buttonNewAn = document.querySelector('.b-2');
const newAn = document.querySelector('.an-mid-left');
const anList = document.querySelector('.an-mid-right');
const title = document.querySelector('.title-tr');
buttonNewAn.addEventListener('click', () => {
    announcementsView.scrollTop = 0;
    buttonAns.removeAttribute("disabled");
    buttonNewAn.setAttribute("disabled", "");
    anList.style.display = "none";
    newAn.style.display = "block";
    title.innerText = "YENI DUYURU";
});
buttonAns.addEventListener('click', allAnsClicked);
function allAnsClicked() {
    announcementsView.scrollTop = 0;
    buttonNewAn.removeAttribute("disabled");
    buttonAns.setAttribute("disabled", "");
    anList.style.display = "block";
    newAn.style.display = "none";
    title.innerText = "DUYURULAR";
}
var delteGotPressed;
var deleteStartDate;
async function deletePressed(el) {
    delteGotPressed = true;
    startDate = el.querySelector('.an-item-dates').getAttribute("startDate");
    deleteStartDate = startDate.substring(6, 10) + "-" + startDate.substring(3, 5) + "-" + startDate.substring(0, 2);
    dateFormated = deleteStartDate.split('-');
    popupContainer.style.display = "flex";
    popupTitle.innerText = "DİKKAT";
    popupText.innerText = `Başlangıç tarihi ${dateFormated[2]}.${dateFormated[1]}.${dateFormated[0]} olan mesajı gerçekten silmek istediğinizden emin misiniz?`;
}
async function triggerDeleteAPI(startDate) {
    if (!localStorage.getItem('token')) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    const result = await fetch(`${serverUrl}/api/deleteAnnouncement`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('token'),
            startDate: startDate
        })
    }).then(response => response.json());
    if (result.status === 'ok') {
        updateTable();
    }
    else if (result.status === 'expired') {
        localStorage.removeItem('token');
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    }
}
function updateTable() {
    if (!localStorage.getItem('token')) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    const token = localStorage.getItem('token');
    fetch(`${serverUrl}/api/get-All-an?token=${token}`)
        .then((data) => { return data.json(); })
        .then((jsonData) => {
        jsonData = jsonData.result;
        let anList = "";
        idx = 0;
        if (jsonData.length === 0) {
            document.querySelector('.an-list').innerHTML = '';
            return;
        }
        jsonData.map((values) => {
            idx++;
            start = values.startDate.substring(8, 10) + "." + values.startDate.substring(5, 7) + "." + values.startDate.substring(0, 4);
            end = values.endDate.substring(8, 10) + "." + values.endDate.substring(5, 7) + "." + values.endDate.substring(0, 4);
            anList +=
                `<div id="data${idx}" class="an-item">

                        <div class="an-item-1">
                            <span class="an-item-dates" startDate="${start}">${start} - ${end}</span>
                            <span onclick="deletePressed(data${idx})" class="an-item-delete">SIL <i class="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div class="an-item-2">
                            <div class="an-item-container">
                                <strong class="an-item-pre">TR:</strong>
                                <span>${values.text.tr}</span>
                            </div>
                            <div class="seperator">
                                <div class="s-1">⬥</div>
                                <div class="s-2"></div>
                                <div class="s-3">⬥</div>
                            </div>
                        </div>

                        <div class="an-item-3">
                            <div class="an-item-container">
                                <strong class="an-item-pre">AR:</strong>
                                <span>${values.text.ar}</span>

                            </div>

                            <div class="seperator">
                                <div class="s-1">⬥</div>
                                <div class="s-2"></div>
                                <div class="s-3">⬥</div>
                            </div>
                        </div>

                        <div class="an-item-4">
                            <div class="an-item-container">
                                <strong class="an-item-pre">DE:</strong>
                                <span> ${values.text.de}</span>

                            </div>

                        </div>
                    </div>`;
            document.querySelector('.an-list').innerHTML = anList;
        });
    });
}
const buttonLogout = document.querySelector('.logout');
buttonLogout.addEventListener('click', () => {
    if (!localStorage.getItem('token')) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    sendRequest(`${serverUrl}/api/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token') }),
    });
    localStorage.removeItem('token');
    loginView.style.display = "block";
    announcementsView.style.display = "none";
});
const impressumA = document.querySelector('.a-impressum');
const impressumA1 = document.querySelector('.a-impressum-1');
const impressumA2 = document.querySelector('.a-impressum-2');
const impressumContainer = document.querySelector('.impressum-container');
const impressumContainer1 = document.querySelector('.impressum-container-1');
const impressumContainer2 = document.querySelector('.impressum-container-2');
let containerCollapsed = true;
let containerCollapsed1 = true;
let containerCollapsed2 = true;
impressumA.addEventListener('click', () => {
    containerCollapsed = !containerCollapsed;
    impressumContainer.style.display = containerCollapsed ? 'none' : 'block';
});
impressumA1.addEventListener('click', () => {
    containerCollapsed1 = !containerCollapsed1;
    impressumContainer1.style.display = containerCollapsed1 ? 'none' : 'block';
});
impressumA2.addEventListener('click', () => {
    containerCollapsed2 = !containerCollapsed2;
    impressumContainer2.style.display = containerCollapsed2 ? 'none' : 'block';
});
popupContainer.addEventListener('click', event => {
    if (delteGotPressed) {
        if (event.target === popupButton) {
            //trigger delete api
            triggerDeleteAPI(deleteStartDate);
        }
        popupContainer.style.display = 'none';
        if (window.innerWidth < 830 && newAnSuccessfull === true) {
            allAnsClicked();
        }
        delteGotPressed = false;
    }
    else {
        if (event.target === popupContainer || event.target === popupButton) {
            popupContainer.style.display = 'none';
            if (window.innerWidth < 830 && newAnSuccessfull === true) {
                allAnsClicked();
            }
        }
    }
});
