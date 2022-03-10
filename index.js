let computers, selectedLaptop;

const computersElement = document.getElementById("computers");
const imageElement = document.getElementById("laptopImage");
const titleElement = document.getElementById("computerName");
const infoElement = document.getElementById("computerInfo");
const featuresElement = document.getElementById('featuresList');
const priceElement = document.getElementById('computerPrice');

const loanValue = document.getElementById('loan');
const payValue = document.getElementById('pay');
const balanceValue = document.getElementById('balance');

// handles click event for Get a loan button
function handleGetLoanButtonClick() {
    const currentLoan = parseInt(loanValue.innerText)
    const currentBalance = parseInt(balanceValue.innerText)

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
    // get current pay value
    const currentPay = payValue.textContent;
    // update pay value
    let pay = parseInt(currentPay) + 100;
    // set pay value in DOM
    document.getElementById("pay").innerText = pay
}

function updateBalance(money) {
    // add extension to round balance value
    let balance = parseInt(balanceValue.innerText)
    balance = balance + parseInt(money)
    // set balance value in DOM
    document.getElementById("balance").innerText = balance
}

// handles click event for Repay Loan button
function handleRepayLoanButton() {
    // get current pay and loan
    const currentPay = parseInt(payValue.textContent)
    const currentLoan = parseInt(loanValue.innerText)

    // check if pay is higher or equal to outstanding loan
    if (currentPay >= currentLoan)
    {
        // update pay & loan in DOM
        payValue.innerText = currentPay - currentLoan
        loanValue.innerText = 0 
    }
    else
    {
        // update pay & loan in DOM
        payValue.innerText = 0
        loanValue.innerText = currentLoan - currentPay
    }
}

// handles click event for Bank button
function handleBankButton() {
    // get current pay, balance and loan from DOM
    let currentPay = parseInt(payValue.textContent)
    let currentBalance = parseInt(balanceValue.innerText)
    let currentLoan = parseInt(loanValue.innerText)

    // check if loan is 0, then all money goes to the balance
    if (currentLoan === 0) { 
        currentBalance = currentBalance + currentPay
        // update balance & pay in DOM
        balanceValue.innerText = currentBalance
        payValue.innerText = 0
    }
    // if loan is higher than 0, 10% of pay is used to pay of the loan dept
    else if (currentLoan > (currentPay * 0.1)) {
        currentLoan = currentLoan - (currentPay * 0.1)
        currentBalance = currentBalance + (currentPay * 0.9)
        // update balance, pay & loan in DOM
        balanceValue.innerText = currentBalance
        payValue.innerText = 0
        loanValue.innerText = currentLoan
    }
    else if (currentLoan <= (currentPay * 0.1)) {
        currentBalance = currentBalance + (currentPay - currentLoan)
        // update balance, pay & loan in DOM
        balanceValue.innerText = currentBalance
        payValue.innerText = 0
        loanValue.innerText = 0
    }
}

// handles click event for Buy Now button
function handleBuyNowButton() {
    const currentBalance = parseInt(balanceValue.innerText)
    // check if balance is high enough
    if (currentBalance >= selectedLaptop.price) {
        // update balance in DOM
        const newBalance = currentBalance - selectedLaptop.price;
        balanceValue.innerText = newBalance;
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

// add computers to dropdown menu and set default computer
const addComputersToMenu = (computers) => {
    computers.forEach(comp => addComputerToMenu(comp));
    selectedLaptop = computers[0];
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    titleElement.innerText = selectedLaptop.title;
    infoElement.innerText = selectedLaptop.description;
    featuresElement.appendChild(makeUl(selectedLaptop.specs));
    priceElement.innerText = selectedLaptop.price;
}

// create option element and add this to the computer dropdown
const addComputerToMenu = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

// update DOM values based on selected option in dropdown menu
const handleComputerMenuChange = e => {
    selectedLaptop = computers[e.target.selectedIndex];
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    titleElement.innerText = selectedLaptop.title;
    infoElement.innerText = selectedLaptop.description;
    featuresElement.innerText = "";
    featuresElement.appendChild(makeUl(selectedLaptop.specs));
    priceElement.innerText = selectedLaptop.price;
}

// eventlistener that checks if a new option has been selected in the computer dropdown
computersElement.addEventListener("change", handleComputerMenuChange)

// convert array to <ul>
function makeUl(array) {
    let list = document.createElement('ul');
    
    // loop through array and add each element as a <li> to the <ul> object
    for (let i = 0; i < array.length; i++) {
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(array[i]));

        list.appendChild(item);
    }
    // return the <ul> object
    return list;
}

// gets called when an image error occurred, replaces the file extension of the image to fix the broken link
const fixImage = (image) => {
    // remove the file extension from the image
    let url = image.src.replace(/\.[^/.]+$/, "");
    // get the current file extension
    let fileExtension = image.src.split('.').pop();
    // switches the .jpg file extension for a .png file extension
    if (fileExtension == "jpg") {
        image.src = url + ".png";
    }
    // switches the .png file extension for a .jpg file extension
    else if (fileExtension == "png") {
        image.src = url + ".jpg";
    }
    // default "image not found" image
    else {
        image.src = "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png";
    }
}