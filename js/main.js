const fromSelected = document.getElementById("from-select");
const toSelected = document.getElementById("to-select");
const algorSelected = document.getElementById("method");
const from = document.getElementById("from-input");
const to = document.getElementById("to-input");
const error = document.getElementById("error");
const info = document.getElementById("info");
const baSt = document.getElementById("meth")
const calcInfo = document.getElementById("calc-info")
info.style.display="none"
calcInfo.style.display="block"


let fromNS = "Binärzahlen", toNS = "Binärzahlen";
let conversionMethod = "basis";

fromSelected.addEventListener("change", function () {
    fromNS = fromSelected.options[fromSelected.selectedIndex].text;
    from.placeholder = fromNS;
});

toSelected.addEventListener("change", function () {
    toNS = toSelected.options[toSelected.selectedIndex].text;
    to.placeholder = toNS;
});

algorSelected.addEventListener("change", function () {
    conversionMethod = algorSelected.value;
});

from.addEventListener("input", function () {
    error.style.display = "none";
});

document.getElementById("convert-button").addEventListener("click", function () {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ''; 
    info.style.display = "none";

    fromValue = from.value;
    
    let number, fromBase;
    switch (fromNS) {
        case "Binärzahlen":
            calcInfo.style.display="none"
            showError("")
            fromBase = 2;
            if (!/^[01]+$/.test(fromValue)) return showError("Ungültige Binärzahlen") ;
            break;
        case "Dezimalzahlen":
            calcInfo.style.display="block"
            showError("")
            fromBase = 10;
            if (!/^[0-9]+$/.test(fromValue)) return showError("Ungültige Dezimalzahlen");
            break;
        case "HexaDezimalzahlen":
            calcInfo.style.display="none"
            showError("")
            fromBase = 16;
            if (!/^[0-9A-Fa-f]+$/.test(fromValue)) return showError("Ungültige HexaDezimalzahlen");
            break;
        case "Oktalzahlen":
            calcInfo.style.display="none"
            showError("")
            fromBase = 8;
            if (!/^[0-7]+$/.test(fromValue)) return showError("Ungültige Oktalzahlen");
            break;
        default:
            return showError("Ungültige Zahlensystem");
    }

    number = parseInt(fromValue, fromBase);
    handleConversion(number, fromBase);
});

function handleConversion(number, fromBase) {
    const tbody = document.querySelector("tbody");
    let targetBase;

    switch (toNS) {
        case "Binärzahlen": targetBase = 2; break;
        case "Dezimalzahlen": targetBase = 10; break;
        case "HexaDezimalzahlen": targetBase = 16; break;
        case "Oktalzahlen": targetBase = 8; break;
        default: return showError("Ungültige Zahlensystem");
    }

    if (conversionMethod === "steWert" && (targetBase === 2 || targetBase === 16)) {
        convertToHexOrBinaryByPlaceValue(number, targetBase);
        baSt.innerText="Stellenwertigkeit"
        info.innerText="Von Oben nach unten (ERGEBNIS) lesen"
    } else {
        convertByDivision(number, targetBase);
        baSt.innerText="Basis"
        info.innerText="Von unten nach oben (RESTE) lesen"
    }
}

function convertByDivision(number, targetBase) {
    const tbody = document.querySelector("tbody");
    let result = "";
    let quotient = number;

    while (quotient > 0) {
        let remainder = quotient % targetBase;
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${quotient}</td>
            <td>÷</td>
            <td>${targetBase}</td>
            <td>=</td>
            <td>${Math.floor(quotient / targetBase)}</td>
            <td>${remainder}</td>
        `;
        tbody.appendChild(newRow);
        result = (remainder < 10 ? remainder : String.fromCharCode(remainder + 55)) + result;
        quotient = Math.floor(quotient / targetBase);
    }

    to.value = result.toUpperCase();
    info.style.display = "block";
}

function convertToHexOrBinaryByPlaceValue(decimal, base) {
    const tbody = document.querySelector("tbody");
    let placeValues = [];
    let maxPower = Math.floor(Math.log(decimal) / Math.log(base));

    for (let i = maxPower; i >= 0; i--) {
        placeValues.push(Math.pow(base, i));
    }

    let result = "";
    for (let i = 0; i < placeValues.length; i++) {
        let placeValue = placeValues[i];
        let quotient = Math.floor(decimal / placeValue);
        let remainder = decimal % placeValue;
        let digit = quotient;
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${decimal}</td>
            <td>÷</td>
            <td>${base}^${maxPower - i}   (${placeValue})  </td>
            <td>=</td>
            <td>${digit}</td>
            <td>${remainder}</td>
        `;
        digit = quotient < 10 ? quotient : String.fromCharCode(quotient + 55);

        tbody.appendChild(newRow);

        result += digit;
        decimal = remainder;
    }

    to.value = result.toUpperCase();
    info.style.display = "block";
}

function showError(message) {
    error.style.display = "block";
    error.innerText = message;
    to.value = "";
}
