let computers = [];

const computersElement = document.getElementById("computers");
const imageElement = document.getElementById("laptopImage");
const titleElement = document.getElementById("computerName");
const infoElement = document.getElementById("computerInfo");
const featuresElement = document.getElementById('featuresList');
const priceElement = document.getElementById('computerPrice');

// handles click event for Get a loan button
function handleGetLoanButtonClick() {
    const currentLoan = parseInt(document.getElementById('loan').innerText)
    const currentBalance = parseInt(document.getElementById('balance').innerText)

    // you cannot get more than one bank loan before repaying the last loan
    if(currentLoan <= 0) {
        let requestedLoan = prompt("Enter loan value: ")
        // check if the user clicked on "cancel"
        if (requestedLoan == null) {
            return;
        }
        // check if the entered value is a number
        else if (isNaN(requestedLoan)) {
            alert("Loan value must be a number")
            // reload prompt to enter loan
            getLoan()
        }
        // you cannot get a loan more than double of your bank balance
        else if (requestedLoan > currentBalance * 2) {
            alert("Loan value can't be more than double of your bank value")
            // reload prompt to enter loan
            getLoan()
        }
        else {
            document.getElementById("loan").innerText = requestedLoan
            updateBalance(requestedLoan)
            confirm("Balance and loan have been updated")
        }
    }
    else {
        alert("You still have one loan pending. Repay this loan first before getting a new one.")
    }
}

// handles click event for Work button
function handleWorkButton() {
    const currentPay = document.getElementById('pay').textContent;
    let pay = parseInt(currentPay) + 100;
    document.getElementById("pay").innerText = pay
}

function updateBalance(money) {
    // add extension to round balance value
    let balance = parseInt(document.getElementById('balance').innerText)
    balance = balance + parseInt(money)
    document.getElementById("balance").innerText = balance
}

function handleRepayLoanButton() {
    const currentPay = parseInt(document.getElementById('pay').textContent)
    const currentLoan = parseInt(document.getElementById('loan').innerText)

    if (currentPay >= currentLoan)
    {
        document.getElementById('pay').innerText = currentPay - currentLoan
        document.getElementById('loan').innerText = 0 
    }
    else
    {
        document.getElementById('pay').innerText = 0
        document.getElementById('loan').innerText = currentLoan - currentPay
    }
}

function handleBankButton() {
    let currentPay = parseInt(document.getElementById('pay').textContent)
    let currentBalance = parseInt(document.getElementById('balance').innerText)
    let currentLoan = parseInt(document.getElementById('loan').innerText)

    if (currentLoan == 0) { // change to === ?
        currentBalance = currentBalance + currentPay
        document.getElementById('balance').innerText = currentBalance
        document.getElementById('pay').innerText = 0
    }
    else if (currentLoan > (currentPay * 0.1)) {
        currentLoan = currentLoan - (currentPay * 0.1)
        currentBalance = currentBalance + (currentPay * 0.9)
        document.getElementById('balance').innerText = currentBalance
        document.getElementById('pay').innerText = 0
        document.getElementById('loan').innerText = currentLoan
    }
    else if (currentLoan <= (currentPay * 0.1)) {
        currentBalance = currentBalance + (currentPay - currentLoan)
        document.getElementById('balance').innerText = currentBalance
        document.getElementById('pay').innerText = 0
        document.getElementById('loan').innerText = 0
    }
}

function handleBuyNowButton() {
    const currentBalance = parseInt(document.getElementById('balance').innerText)
    // check if balance is high enough
    if (currentBalance >= selectedLaptop.price) {
        const newBalance = currentBalance - selectedLaptop.price;
        document.getElementById('balance').innerText = newBalance;
        alert("You are now the owner of the laptop : " + selectedLaptop.title);
    }
    else {
        alert("You cannot afford this laptop.")
    }
}


// load computer info
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json()) // convert data
    .then(data => computers = data) // assign api data to computer array
    .then(computers => addComputersToMenu(computers));

const addComputersToMenu = (computers) => {
    computers.forEach(comp => addComputerToMenu(comp));
    selectedLaptop = computers[0];
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    titleElement.innerText = selectedLaptop.title;
    infoElement.innerText = selectedLaptop.description;
    featuresElement.appendChild(makeUl(selectedLaptop.specs));
    priceElement.innerText = selectedLaptop.price;
}

const addComputerToMenu = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

const handleComputerMenuChange = e => {
    selectedLaptop = computers[e.target.selectedIndex];
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    titleElement.innerText = selectedLaptop.title;
    infoElement.innerText = selectedLaptop.description;
    featuresElement.innerText = "";
    featuresElement.appendChild(makeUl(selectedLaptop.specs));
    console.log(makeUl(selectedLaptop.specs))
    priceElement.innerText = selectedLaptop.price;
}

computersElement.addEventListener("change", handleComputerMenuChange)

// https://stackoverflow.com/questions/11128700/create-a-ul-and-fill-it-based-on-a-passed-array
function makeUl(array) {
    let list = document.createElement('ul');
    
    for (let i = 0; i < array.length; i++) {
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(array[i]));

        list.appendChild(item);
    }
    return list;
}
