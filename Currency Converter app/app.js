const BASE_URL_LATEST = "https://api.currencyapi.com/v3/latest";
const BASE_URL_CURRENCIES = "https://api.currencyapi.com/v3/currencies";
const API_KEY = "cur_live_k3G3NUWhaY7F2HFuYKpY3XIwXyhxzJTpha5nr8Kx";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

async function fetchCurrencies() {
    const response = await fetch(`${BASE_URL_CURRENCIES}?apikey=${API_KEY}`);
    const data = await response.json();
    return data.data;
}   

// Initialize dropdowns
fetchCurrencies().then(currencyDetails => {
    for (let select of dropdowns) {
        for (const currCode in currencyDetails) {
            let newOption = document.createElement("option");
            newOption.innerText = `${currCode} - ${currencyDetails[currCode].name}`;
            newOption.value = currCode;
            if (select.name === "from" && currCode === "USD") {
                newOption.selected = "selected";
            } else if (select.name === "to" && currCode === "INR") {
                newOption.selected = "selected";
            }
            select.append(newOption);
        }

        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
            updateConversionRate();
        });
    }
});

const updateConversionRate = async () => {
    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;
    const URL = `${BASE_URL_LATEST}?base_currency=${fromCurrency}&currencies=${toCurrency}&apikey=${API_KEY}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (!data.data) {
            throw new Error('No data field in API response.');
        }

        const toRate = data.data[toCurrency] ? data.data[toCurrency].value : null;

        if (toRate) {
            msg.textContent = `1 ${fromCurrency} = ${toRate.toFixed(3)} ${toCurrency}`;
        } else {
            msg.textContent = 'Conversion rate not available';
        }
    } catch (error) {
        msg.textContent = 'Error fetching conversion rate';
        console.error('Error:', error);
    }
};


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".from input");
    let amountValue = parseFloat(amount.value);

    if (!amountValue || amountValue < 1) {
        amountValue = 1;
        amount.value = "1";
    }

    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;
    const URL = `${BASE_URL_LATEST}?base_currency=${fromCurrency}&currencies=${toCurrency}&apikey=${API_KEY}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (!data.data) {
            throw new Error('No data field in API response.');
        }

        const toRate = data.data[toCurrency] ? data.data[toCurrency].value : null;
        // console.log(data.data[toCurrency]);

        if (toRate) {
            const finalAmount = amountValue * toRate;
            const convertedAmountInput = document.querySelector(".to input");
            convertedAmountInput.value = finalAmount.toFixed(6); 
        } else {
            console.error('Invalid currency codes or rates not found.');
        }
    } 
    catch (error) {
        console.error('Error:', error);
    }
});
