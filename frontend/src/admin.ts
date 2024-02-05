//@ts-ignore
const serverUrl = "https://namaz-backend.herokuapp.com";

// Get references to the forms on the page
const loginForm: HTMLElement = ensureHTMLElement(
    document.getElementById("log-form")
);
const anForm: HTMLElement = ensureHTMLElement(
    document.getElementById("new-an")
);

// Get references to the input fields for the new announcement form
const startDateEl: HTMLElement = ensureHTMLElement(
    document.getElementById("start-date")
);
const endDateEl: HTMLElement = ensureHTMLElement(
    document.getElementById("end-date")
);
const anTr: HTMLElement = ensureHTMLElement(document.getElementById("new-tr"));
const anAr: HTMLElement = ensureHTMLElement(document.getElementById("new-ar"));
const anDe: HTMLElement = ensureHTMLElement(document.getElementById("new-de"));

// Get reference to the submit button for the new announcement form
const anSubmit: HTMLElement = ensureHTMLElement(
    document.getElementById("an-submit")
);

// Different Views
const loginView: HTMLElement = ensureHTMLElement(
    document.querySelector(".card")
);
const announcementsView: HTMLElement = ensureHTMLElement(
    document.querySelector(".announcements")
);

// Get reference for popup to show error messages
const popupTitle: HTMLElement = ensureHTMLElement(
    document.querySelector(".popup-title")
);
const popupText: HTMLElement = ensureHTMLElement(
    document.querySelector(".popup-text")
);

const popupContainer: HTMLElement = ensureHTMLElement(
    document.querySelector(".popup-container")
);
const popupButton: HTMLElement = ensureHTMLElement(
    document.querySelector(".popup-button")
);

function ensureHTMLElement(element: Element | null): HTMLElement {
    if (element instanceof HTMLElement) {
        return element;
    } else {
        throw new Error();
    }
}

if (localStorage.getItem("token")) {
    checkToken();
}

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

// Helper function to send a request to the server
async function sendRequest(url: string, options: any) {
    // Send the request to the given URL with the given options
    // and return the response as JSON
    return fetch(url, options).then((res) => res.json());
}

const showPassword: HTMLElement = ensureHTMLElement(
    document.querySelector(".fa-eye")
);
const hidePassword: HTMLElement = ensureHTMLElement(
    document.querySelector(".fa-eye-slash")
);

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
loginForm.addEventListener("submit", () => login);

// Function to handle the submission of the login form
async function login(event: FormDataEvent) {
    // Prevent the default form submission behavior
    event.preventDefault();
    if (document == null) {
        return;
    }
    // Get the values of the input fields
    const userNameField = ensureHTMLElement(
        document.getElementById("l-username")
    );
    let username: string;
    if (userNameField instanceof HTMLInputElement) {
        username = userNameField.value;
    } else {
        throw new Error("no username");
    }

    const passwordField: HTMLElement = ensureHTMLElement(
        document.getElementById("l-password")
    );
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

    const submitButton: HTMLElement = ensureHTMLElement(
        document.getElementById("submit-login")
    );
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

    resetInputField(ensureHTMLElement(document.getElementById("l-username")));
    resetInputField(ensureHTMLElement(document.getElementById("l-password")));
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

/**
 * clears content of input field and sets it to ""
 * @param field input field which needs its contend cleared
 */
function resetInputField(field: HTMLElement): void {
    if (field instanceof HTMLInputElement) {
        field.value = "";
    }
}

// Event listener for the window's resize event
window.addEventListener("resize", () => {
    // If the window width is greater than 830 pixels
    if (window.innerWidth > 830) {
        // Get the elements with the class 'an-mid-left' and 'an-mid-right'
        const newAn: HTMLElement = ensureHTMLElement(
            document.querySelector(".an-mid-left")
        );
        const anList: HTMLElement = ensureHTMLElement(
            document.querySelector(".an-mid-right")
        );

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
    const submitButtonLogin: HTMLElement = ensureHTMLElement(
        document.getElementById("submit-login")
    );

    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (username && password) {
        submitButtonLogin.removeAttribute("disabled");
    } else {
        submitButtonLogin.setAttribute("disabled", "true");
    }
}

const usernameInput: HTMLElement = ensureHTMLElement(
    document.getElementById("l-username")
);
const passwordInput: HTMLElement = ensureHTMLElement(
    document.getElementById("l-password")
);

usernameInput.addEventListener("input", updateSubmitButtonLogin);
passwordInput.addEventListener("input", updateSubmitButtonLogin);

/**
 * extracts the string within an html-input-element
 * @param element potential html-input-element which needs it value extracted
 * @returns value in html-input-element
 */
function retrieveTextFromHtmlInputElement(element: HTMLElement | null): string {
    const htmlElement = ensureHTMLElement(element);
    if (htmlElement instanceof HTMLInputElement) {
        return htmlElement.value;
    } else {
        throw new Error("element is not a html__input__element");
    }
}

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
    const submitButton: HTMLElement = ensureHTMLElement(
        document.getElementById("an-submit")
    );

    // If all input fields have a value, enable the submit button
    // Otherwise, disable it
    if (anTr && anAr && anDe) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "true");
    }
}
const anTrInput: HTMLElement = ensureHTMLElement(
    document.getElementById("new-tr")
);
const anArInput: HTMLElement = ensureHTMLElement(
    document.getElementById("new-ar")
);
const anDeInput: HTMLElement = ensureHTMLElement(
    document.getElementById("new-de")
);

anTrInput.addEventListener("input", updateSubmitButton);
anArInput.addEventListener("input", updateSubmitButton);
anDeInput.addEventListener("input", updateSubmitButton);

const buttonAns: HTMLElement = ensureHTMLElement(
    document.querySelector(".b-1")
);
const buttonNewAn: HTMLElement = ensureHTMLElement(
    document.querySelector(".b-2")
);
const newAn: HTMLElement = ensureHTMLElement(
    document.querySelector(".an-mid-left")
);
const anList: HTMLElement = ensureHTMLElement(
    document.querySelector(".an-mid-right")
);
const title: HTMLElement = ensureHTMLElement(
    document.querySelector(".title-tr")
);

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

let delteGotPressed: boolean;
let deleteStartDate: string;

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

function updateTable() {
    if (!localStorage.getItem("token")) {
        loginView.style.display = "block";
        announcementsView.style.display = "none";
        return null;
    }
    const token = localStorage.getItem("token");
    fetch(`${serverUrl}/api/get-All-an?token=${token}`)
        .then((data) => {
            return data.json();
        })
        .then((jsonData) => {
            jsonData = jsonData.result;
            let anList: string = "";
            let idx: number = 0;
            let anListElement: HTMLElement = ensureHTMLElement(
                document.querySelector(".an-list")
            );
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

                ensureHTMLElement(
                    document.querySelector(".an-list")
                ).innerHTML = anList;
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

const impressumA: HTMLElement = ensureHTMLElement(
    document.querySelector(".a-impressum")
);
const impressumA1: HTMLElement = ensureHTMLElement(
    document.querySelector(".a-impressum-1")
);
const impressumA2: HTMLElement = ensureHTMLElement(
    document.querySelector(".a-impressum-2")
);

const impressumContainer: HTMLElement = ensureHTMLElement(
    document.querySelector(".impressum-container")
);
const impressumContainer1: HTMLElement = ensureHTMLElement(
    document.querySelector(".impressum-container-1")
);
const impressumContainer2: HTMLElement = ensureHTMLElement(
    document.querySelector(".impressum-container-2")
);

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
