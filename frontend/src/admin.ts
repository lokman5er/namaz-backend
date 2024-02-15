// Helper function to send a request to the server
async function sendRequest(url: string, options: any) {
    // Send the request to the given URL with the given options
    // and return the response as JSON
    return fetch(url, options).then((res) => res.json());
}
/**
 * clears content of input field and sets it to ""
 * @param field input field which needs its contend cleared
 */
function resetInputField(field: HTMLElement): void {
    if (field instanceof HTMLInputElement) {
        field.value = "";
    }
}

/**
 * extracts the string within an html-input-element
 * @param element potential html-input-element which needs it value extracted
 * @returns value in html-input-element
 */
function retrieveTextFromHtmlInputElement(
    element: HTMLElement | null
): string {
    const htmlElement = element as HTMLElement;
    if (htmlElement instanceof HTMLInputElement) {
        return htmlElement.value;
    } else {
        throw new Error("element is not a html__input__element");
    }
}

//@ts-ignore
const serverUrl = "https://namaz-backend.herokuapp.com";

// Get references to the forms on the page
const loginForm: HTMLElement =  document.getElementById("log-form") as HTMLElement;
const anForm: HTMLElement =  document.getElementById("new-an") as HTMLElement;

// Get references to the input fields for the new announcement form
const startDateEl: HTMLElement =  document.getElementById("start-date") as HTMLElement;
const endDateEl: HTMLElement =  document.getElementById("end-date") as HTMLElement;
const anTr: HTMLElement = document.getElementById("new-tr") as HTMLElement;
const anAr: HTMLElement = document.getElementById("new-ar") as HTMLElement;
const anDe: HTMLElement = document.getElementById("new-de") as HTMLElement;

// Get reference to the submit button for the new announcement form
const anSubmit: HTMLElement =  document.getElementById("an-submit") as HTMLElement;

// Different Views
const loginView: HTMLElement =  document.querySelector(".card") as HTMLElement;
const announcementsView: HTMLElement =  document.querySelector(".announcements") as HTMLElement;

// Get reference for popup to show error messages
const popupTitle: HTMLElement =  document.querySelector(".popup-title") as HTMLElement;
const popupText: HTMLElement =  document.querySelector(".popup-text") as HTMLElement;

const popupContainer: HTMLElement =  document.querySelector(".popup-container") as HTMLElement;
const popupButton: HTMLElement =  document.querySelector(".popup-button") as HTMLElement;

if (localStorage.getItem("token")) {
    checkToken();
}

let delteGotPressed: boolean;
let deleteStartDate: string;

async function checkToken() {
    const token = localStorage.getItem("token");
    const result = await sendRequest(
        `${serverUrl}/api/check-token?token=${token}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (result.status === "ok" && loginView != null) {
        loginView.style.display = "none";
        announcementsView.style.display = "block";
        updateTable();
    } else {
        localStorage.removeItem("token");
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    }
}

const showPassword: HTMLElement =  document.querySelector(".fa-eye") as HTMLElement;
const hidePassword: HTMLElement =  document.querySelector(".fa-eye-slash") as HTMLElement;

showPassword.addEventListener("click", () => {
    if (passwordInput instanceof HTMLInputElement) {
        passwordInput.type = "text";
    }
    showPassword.style.display = "none";
    hidePassword.style.display = "inline";
});

hidePassword.addEventListener("click", () => {
    if (passwordInput instanceof HTMLInputElement) {
        passwordInput.type = "password";
    }
    hidePassword.style.display = "none";
    showPassword.style.display = "inline";
});

// Event listener for the login form's submit event
// TODO will this even work?
loginForm.addEventListener("submit", login);

// Function to handle the submission of the login form
async function login(event:any) {
    // Prevent the default form submission behavior
    event.preventDefault();
    if (document == null) {
        return;
    }
    // Get the values of the input fields
    const userNameField =  document.getElementById("l-username") as HTMLElement;
    let username: string;
    if (userNameField instanceof HTMLInputElement) {
        username = userNameField.value;
    } else {
        throw new Error("no username");
    }

    const passwordField: HTMLElement =  document.getElementById("l-password") as HTMLElement;
    let password: string;
    if (passwordField instanceof HTMLInputElement) {
        password = passwordField.value;
    } else {
        throw new Error("no password");
    }

    // Send a POST request to the server to login
    const result = await sendRequest(`${serverUrl}/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    // If the request was successful, store the returned token in local storage
    // Otherwise, show an error with the error message

    const submitButton: HTMLElement =  document.getElementById("submit-login") as HTMLElement;
    if (result.status === "ok") {
        if (submitButton instanceof HTMLButtonElement) {
            submitButton.setAttribute("disabled", "true");
        }
        loginView.style.display = "none";
        announcementsView.style.display = "block";
        localStorage.setItem("token", result.data);

        //load the right announcements data with api
        updateTable();
    } else {
        if (submitButton instanceof HTMLButtonElement) {
            submitButton.setAttribute("disabled", "true");
        }
        popupContainer.style.display = "flex";
        popupText.innerText = result.error;
    }

    resetInputField(document.getElementById("l-username") as HTMLElement);

    resetInputField(document.getElementById("l-password") as HTMLElement);



}

// Set the current date as the minimum value for the start and end date fields
if (startDateEl instanceof HTMLInputElement) {
    startDateEl.valueAsDate = new Date();
}
if (endDateEl instanceof HTMLInputElement) {
    endDateEl.valueAsDate = new Date();
}
startDateEl.setAttribute("min", retrieveTextFromHtmlInputElement(startDateEl));
endDateEl.setAttribute("min", retrieveTextFromHtmlInputElement(startDateEl));

// Event listener for the date field's change event
startDateEl.addEventListener("change", () => {
    // If the end date is earlier than the start date, set the end date to the start date
    if (
        retrieveTextFromHtmlInputElement(endDateEl) <
        retrieveTextFromHtmlInputElement(startDateEl)
    ) {
        if (
            endDateEl instanceof HTMLInputElement &&
            startDateEl instanceof HTMLInputElement
        ) {
            endDateEl.valueAsDate = startDateEl.valueAsDate;
        }
    }
    // Set the minimum value for the end date field to the start date
    endDateEl.setAttribute(
        "min",
        retrieveTextFromHtmlInputElement(startDateEl)
    );
});

// Event listener for the new announcement form's submit event
anForm.addEventListener("submit", newAnnouncement);

var newAnSuccessfull = false;
// Function to handle the submission of the new announcement form
async function newAnnouncement(event: SubmitEvent) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (!localStorage.getItem("token")) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }

    // Get the values of the input fields
    const anTr1 = retrieveTextFromHtmlInputElement(anTr);
    const anAr1 = retrieveTextFromHtmlInputElement(anAr);
    const anDe1 = retrieveTextFromHtmlInputElement(anDe);
    const startDate = retrieveTextFromHtmlInputElement(startDateEl);
    const endDate = retrieveTextFromHtmlInputElement(endDateEl);

    // Send a POST request to the server to create a new announcement
    const result = await sendRequest(`${serverUrl}/api/new-an`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: {
                tr: anTr1,
                ar: anAr1,
                de: anDe1,
            },
            startDate,
            endDate,
            token: localStorage.getItem("token"),
        }),
    });

    // If the request was successful, show a success alert
    // Otherwise, show an error alert with the error message
    if (result.status === "ok") {
        newAnSuccessfull = true;
        popupContainer.style.display = "flex";
        popupTitle.innerText = "BAŞARI";
        popupText.innerText = "Duyuru başarıyla eklendi.";
        resetInputField(anTr);
        resetInputField(anAr);
        resetInputField(anDe);
        anSubmit.setAttribute("disabled", "true");
        if (startDateEl instanceof HTMLInputElement) {
            startDateEl.valueAsDate = new Date();
        }
        if (endDateEl instanceof HTMLInputElement) {
            endDateEl.valueAsDate = new Date();
        }
        startDateEl.setAttribute(
            "min",
            retrieveTextFromHtmlInputElement(startDateEl)
        );
        endDateEl.setAttribute(
            "min",
            retrieveTextFromHtmlInputElement(startDateEl)
        );
    } else if (result.status === "expired") {
        localStorage.removeItem("token");
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    } else {
        popupTitle.innerText = "HATA";
        popupContainer.style.display = "flex";
        popupContainer.style.position = "absolute";
        popupText.innerText = result.error;
    }

    updateTable();
}

// Event listener for the window's resize event
window.addEventListener("resize", () => {
    // If the window width is greater than 830 pixels
    if (window.innerWidth > 830) {
        // Get the elements with the class 'an-mid-left' and 'an-mid-right'
        const newAn: HTMLElement =  document.querySelector(".an-mid-left") as HTMLElement;
        const anList: HTMLElement =  document.querySelector(".an-mid-right") as HTMLElement;

        // Remove the 'display' CSS attribute from both elements
        newAn.style.display = "";
        anList.style.display = "";

        title.innerText = "DUYURULAR";
    } else {
        buttonNewAn.removeAttribute("disabled");
        buttonAns.setAttribute("disabled", "");
    }
});

function updateSubmitButtonLogin() {
    //Get the values of the input fields;
    const username = retrieveTextFromHtmlInputElement(
        document.getElementById("l-username")
    );
    const password = retrieveTextFromHtmlInputElement(
        document.getElementById("l-password")
    );

    // Get the submit button
    const submitButtonLogin: HTMLElement =  document.getElementById("submit-login") as HTMLElement;

    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (username && password) {
        submitButtonLogin.removeAttribute("disabled");
    } else {
        submitButtonLogin.setAttribute("disabled", "true");
    }
}

const usernameInput: HTMLElement =  document.getElementById("l-username") as HTMLElement;
const passwordInput: HTMLElement =  document.getElementById("l-password") as HTMLElement;

usernameInput.addEventListener("input", updateSubmitButtonLogin);
passwordInput.addEventListener("input", updateSubmitButtonLogin);

//for new announcement
function updateSubmitButton() {
    // Get the values of the input fields
    const anTr = retrieveTextFromHtmlInputElement(
        document.getElementById("new-tr")
    );
    const anAr = retrieveTextFromHtmlInputElement(
        document.getElementById("new-ar")
    );
    const anDe = retrieveTextFromHtmlInputElement(
        document.getElementById("new-de")
    );

    // Get the submit button
    const submitButton: HTMLElement =  document.getElementById("an-submit") as HTMLElement;

    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (anTr && anAr && anDe) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "true");
    }
}
const anTrInput: HTMLElement =  document.getElementById("new-tr") as HTMLElement;
const anArInput: HTMLElement =  document.getElementById("new-ar") as HTMLElement;
const anDeInput: HTMLElement =  document.getElementById("new-de") as HTMLElement;

anTrInput.addEventListener("input", updateSubmitButton);
anArInput.addEventListener("input", updateSubmitButton);
anDeInput.addEventListener("input", updateSubmitButton);

const buttonAns: HTMLElement =  document.querySelector(".b-1") as HTMLElement;
const buttonNewAn: HTMLElement =  document.querySelector(".b-2") as HTMLElement;
const newAn: HTMLElement =  document.querySelector(".an-mid-left") as HTMLElement;
const anList: HTMLElement =  document.querySelector(".an-mid-right") as HTMLElement;
const title: HTMLElement =  document.querySelector(".title-tr") as HTMLElement;

buttonNewAn.addEventListener("click", () => {
    announcementsView.scrollTop = 0;
    buttonAns.removeAttribute("disabled");
    buttonNewAn.setAttribute("disabled", "");
    anList.style.display = "none";
    newAn.style.display = "block";
    title.innerText = "YENI DUYURU";
});

buttonAns.addEventListener("click", allAnsClicked);

function allAnsClicked() {
    announcementsView.scrollTop = 0;
    buttonNewAn.removeAttribute("disabled");
    buttonAns.setAttribute("disabled", "");
    anList.style.display = "block";
    newAn.style.display = "none";
    title.innerText = "DUYURULAR";
}

function updateTable() {
    if (!localStorage.getItem("token")) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    const token = localStorage.getItem("token");
    let anList: string = "";
    let idx: number = 0;
    fetch(`${serverUrl}/api/get-All-an?token=${token}`)
        .then((data) => {
            return data.json();
        })
        .then((jsonData) => {
            jsonData = jsonData.result;
            let anListElement: HTMLElement =  document.querySelector(".an-list") as HTMLElement;
            if (jsonData.length === 0 && document !== null) {
                anListElement.innerHTML = "";
                return;
            }
            jsonData.map((values: any) => {
                idx++;
                let start: string =
                    values.startDate.substring(8, 10) +
                    "." +
                    values.startDate.substring(5, 7) +
                    "." +
                    values.startDate.substring(0, 4);
                let end: string =
                    values.endDate.substring(8, 10) +
                    "." +
                    values.endDate.substring(5, 7) +
                    "." +
                    values.endDate.substring(0, 4);
                anList += `<div id="data${idx}" class="an-item">

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

                
                    const anListElement:HTMLElement = document.querySelector(".an-list") as HTMLElement
                    anListElement.innerHTML = anList;
            });
        });
}

const buttonLogout = document.querySelector(".logout");

if (buttonLogout == null) {
    throw new Error("no logout button");
}

buttonLogout.addEventListener("click", () => {
    if (!localStorage.getItem("token")) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }

    sendRequest(`${serverUrl}/api/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
    });

    localStorage.removeItem("token");
    loginView.style.display = "block";
    announcementsView.style.display = "none";
});

const impressumA: HTMLElement =  document.querySelector(".a-impressum") as HTMLElement;
const impressumA1: HTMLElement =  document.querySelector(".a-impressum-1") as HTMLElement;
const impressumA2: HTMLElement =  document.querySelector(".a-impressum-2") as HTMLElement;

const impressumContainer: HTMLElement =  document.querySelector(".impressum-container") as HTMLElement;
const impressumContainer1: HTMLElement =  document.querySelector(".impressum-container-1") as HTMLElement;
const impressumContainer2: HTMLElement =  document.querySelector(".impressum-container-2") as HTMLElement;

let containerCollapsed = true;
let containerCollapsed1 = true;
let containerCollapsed2 = true;

impressumA.addEventListener("click", () => {
    containerCollapsed = !containerCollapsed;
    impressumContainer.style.display = containerCollapsed ? "none" : "block";
});

impressumA1.addEventListener("click", () => {
    containerCollapsed1 = !containerCollapsed1;
    impressumContainer1.style.display = containerCollapsed1 ? "none" : "block";
});

impressumA2.addEventListener("click", () => {
    containerCollapsed2 = !containerCollapsed2;
    impressumContainer2.style.display = containerCollapsed2 ? "none" : "block";
});

async function triggerDeleteAPI(startDate: string) {
    if (!localStorage.getItem("token")) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }

    const result = await fetch(`${serverUrl}/api/deleteAnnouncement`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("token"),
            startDate: startDate,
        }),
    }).then((response) => response.json());
    if (result.status === "ok") {
        updateTable();
    } else if (result.status === "expired") {
        localStorage.removeItem("token");
        loginView.style.display = "block";
        announcementsView.style.display = "none";
    }
}

popupContainer.addEventListener("click", (event) => {
    if (delteGotPressed) {
        if (event.target === popupButton) {
            //trigger delete api
            triggerDeleteAPI(deleteStartDate);
        }
        popupContainer.style.display = "none";
        if (window.innerWidth < 830 && newAnSuccessfull === true) {
            allAnsClicked();
        }
        delteGotPressed = false;
    } else {
        if (event.target === popupContainer || event.target === popupButton) {
            popupContainer.style.display = "none";
            if (window.innerWidth < 830 && newAnSuccessfull === true) {
                allAnsClicked();
            }
        }
    }
});
