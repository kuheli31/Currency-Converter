const API_URL =
  "https://2024-03-06.currency-api.pages.dev/v1/currencies/eur.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const populateDropdowns = async () => {
  try {
    // Fetch currency data
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data || !data.eur) throw new Error("Invalid response from API");

    const currencyCodes = Object.keys(data.eur);

    // Populate dropdown options
    dropdowns.forEach((select) => {
      currencyCodes.forEach((currCode) => {
        let option = document.createElement("option");
        option.value = currCode;
        option.innerText = currCode.toUpperCase();

        // Set the default options
        if (select === fromCurr && currCode === "usd") {
          option.selected = true;
        } else if (select === toCurr && currCode === "inr") {
          option.selected = true;
        }

        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Error populating dropdowns:", error.message);
  }
};

// Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    // Fetch data from the provided API
    const response = await fetch(API_URL);
    const data = await response.json();

    // Validate the response
    if (!data || !data.eur || !data.eur[toCurr.value.toLowerCase()]) {
      throw new Error("Invalid response from API");
    }

    // Get the exchange rate
    const rate = data.eur[toCurr.value.toLowerCase()];
    const finalAmount = (amtVal * rate).toFixed(2);

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value.toUpperCase()} = ${finalAmount} ${toCurr.value.toUpperCase()}`;

  } catch (error) {
    msg.innerText = "Failed to fetch exchange rates. Try again.";
    console.error("Error:", error.message);
  }
};

// Update flag image based on the selected currency
const updateFlag = (selectElement) => {
  let currCode = selectElement.value;
  let countryCode = currCode.slice(0, 2).toUpperCase(); // Get the first two characters for country code
  let flagImage = selectElement.parentElement.querySelector("img");

  // Ensure flag image is only updated if it exists
  if (flagImage) {
    // Set the flag image based on the currency code
    flagImage.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};

// Event listeners for form button and window load
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  populateDropdowns();
  updateExchangeRate();
});

// Event listeners to update flags on dropdown change
fromCurr.addEventListener("change", () => {
  updateFlag(fromCurr);
});

toCurr.addEventListener("change", () => {
  updateFlag(toCurr);
});
