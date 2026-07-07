import { setMenuOpen } from './utils';
import { apiUrl } from './constants';
let apiCalled = false;
let dealsData = [];
let dealsWon = [];
let dealsLoaded = [];
let initialDealsLoaded = false; // this will be become false after the wheel has spinned one time
let alreadySpin = 0; // to how much degree has the wheel already spined

const displayDealWon = document.querySelector('.deal-won');
const specialDealsOpenBtn = document.querySelector('.special-deals-btn');
const dealsModal = document.querySelector('.deals-modal');
const dealsCloseBtns = document.querySelectorAll('.deals__close-btn');
const spinBtn = document.querySelector('.spin-wheel__circle__spin-btn');
const viewUnlockDealsBtn = document.querySelector('.view-unlock-deals');
const specialDealsSection = document.querySelector('.special-deals');
const unlockedDealsSection = document.querySelector('.unlocked-deals');
const dealDetails = document.querySelector('.deal-details');
const backToSpecialDealsBtn = document.querySelector(
    '.back-to-special-deals-btn',
);
const displayDealsSection = document.querySelector(
    '.unlocked-deals__display-section',
);
const specialDealsCloseBtn = document.querySelector('.special-deals-close-btn');
const unlockedDealsCloseBtn = document.querySelector(
    '.unlocked-deals-close-btn',
);

specialDealsOpenBtn.addEventListener('click', (e) => {
    e.preventDefault();
    init();
});
dealsCloseBtns.forEach((dealsCloseBtn) => {
    dealsCloseBtn.addEventListener('click', () => {
        document.body.style.overflow = '';
        dealsModal.style.display = 'none';
        unloadDeals();
    });
});
viewUnlockDealsBtn.addEventListener('click', () => {
    specialDealsSection.style.display = 'none';
    unlockedDealsSection.style.display = 'block';
    unlockedDealsCloseBtn.focus();
});
backToSpecialDealsBtn.addEventListener('click', () => {
    unlockedDealsSection.style.display = 'none';
    specialDealsSection.style.display = 'block';
    specialDealsCloseBtn.focus();
});

/**
 * Fetches deal data from the API and updates the global state.
 * Handles network errors and HTTP status failures, resetting the `apiCalled` flag on failure to allow retries.
 *
 * @async
 * @function getDealsData
 * @returns {Promise<void>} A promise that resolves when data is fetched or rejects on error.
 */
async function getDealsData() {
    try {
        const rawData = await fetch(apiUrl);

        // Check if the response status is OK
        if (!rawData.ok) {
            throw new Error(`HTTP error! Status: ${rawData.status}`);
        }

        const data = await rawData.json();

        dealsData = structuredClone(data);
        apiCalled = true;
    } catch (error) {
        // Keep apiCalled as FALSE so it can retry next time
        apiCalled = false;
        alert(`Failed to load deals. Please refresh the page.  ${error}`);
    }
}
/**
 * Initializes the deals modal interface and triggers the data fetch if not already loaded.
 * Manages the transition from the loading state to the visible spin wheel upon successful data retrieval.
 *
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when the modal is fully initialized and the wheel is ready.
 *
 * @sideeffects
 * - Closes the mobile menu via `setMenuOpen(false)`.
 * - Disables body scrolling (`overflow: hidden`).
 * - Displays the `dealsModal`.
 * - Calls `getDealsData()` to fetch deals if `apiCalled` is false.
 * - Toggles visibility of loading, spin wheel, and unlock view elements.
 * - Executes `loadDealsInWheel()` to render initial deals.
 * - Attaches a 'click' event listener to `spinBtn`.
 */
async function init() {
    setMenuOpen(false);
    document.body.style.overflow = 'hidden';
    dealsModal.style.display = 'block';
    specialDealsSection.style.display !== 'none'
        ? specialDealsCloseBtn.focus()
        : unlockedDealsCloseBtn.focus();

    if (!apiCalled) {
        await getDealsData();
        // Hide loading, show content
        document.querySelector('.loading-wheel').style.display = 'none';
        document.querySelector('.spin-wheel').style.display = 'block';
        document.querySelector('.view-unlock-deals').style.display = 'flex';
        spinBtn.addEventListener('click', spinWheel);
    } else {
        displayDealWon.style.visibility = 'hidden';
        const wheel = document.querySelector('.spin-wheel__circle');
        const rotation = Math.floor(alreadySpin / 360);
        alreadySpin = (rotation + 1) * 360;
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${alreadySpin}deg)`;
    }
    dealsLoaded = loadDealsInWheel();
    initialDealsLoaded = true;
}

/**
 * it unloads deals from dealsLoaded back to dealsData
 * @returns {null}
 */
function unloadDeals() {
    for (let deals of dealsLoaded) {
        if (deals == null) continue;
        dealsData.push(deals);
    }
    dealsLoaded = [];
}

/**
 * Selects a random deal from the dealsData array and removes it.
 * @returns {object|null} The randomly selected deal object, or null if the array is empty.
 */
function getRandomDeal() {
    let size = dealsData.length;
    if (size == 0) return null;
    let pickedInd = Math.floor(Math.random() * size);
    let deal = dealsData[pickedInd];
    dealsData.splice(pickedInd, 1); // delete object at pickedInd
    return deal;
}
/**
 * loads 4 random deals into the wheel , if there is no deal available it loads "No deal available"
 * @returns {Array of objects} array of deals that are randomly selected
 */
function loadDealsInWheel() {
    let dealsLoaded = [];
    for (let i = 1; i <= 4; i++) {
        let dealObj = getRandomDeal();
        dealsLoaded.push(dealObj);
        let wheelPrizeQuad = document
            .querySelector(`.prize${i}`)
            .querySelector('p');
        wheelPrizeQuad.textContent = dealObj
            ? dealObj.label
            : 'No deal available';
    }
    return dealsLoaded;
}
/**
 * Creates and returns a new DOM element structure for a deal details card.
 * Generates the inner HTML skeleton safely, leaving text content fields empty for later population.
 *
 * @function createDealDetailsTemplate
 * @param {string} className - The CSS class name to apply to the root element (e.g., 'deal-expired' or '').
 * @returns {HTMLDivElement} The newly created div element containing the deal card structure.
 */
function createDealDetailsTemplate(className) {
    const dealDetailsElement = document.createElement('div');
    dealDetailsElement.className = `deal-details ${className}`;

    // Build the inner structure
    dealDetailsElement.innerHTML = `
            <div class="deal-details__coupon-detail">
                <div class="deal-details__coupon-detail__name"></div>
                <div class="deal-details__coupon-detail__expired-in"></div>
            </div>
            <div class="deal-details__code-section">
                <div class="deal-details__code-section__coupon-code"></div>
                <button
                    class="deal-details__code-section__copy-btn"
                    type="button"
                    aria-label="Copy coupon code"
                >
                    <img src="/assets/copy.svg" alt="" />
                </button>
            </div>
        `;
    return dealDetailsElement;
}

/**
 * Renders a list of unlocked deals into the display section, handling expired states.
 * Dynamically creates DOM elements for each deal, safely injecting text content to prevent XSS.
 * Marks deals as expired if the current date exceeds their validity period.
 *
 * @function renderUnlockedDeals
 * @param {Array<Object>} dealsWon - An array of deal objects containing promo code details.
 * @returns {void}
 */
function renderUnlockedDeals(dealsWon) {
    displayDealsSection.innerHTML = '';
    dealsWon.forEach((dealObj) => {
        let validFor = dealObj.validFor
            ? `Expires in ${dealObj.validFor}d`
            : 'Expires in 7d';
        const expiryDate = addDays(dealObj.validFrom, dealObj.validFor);
        const className = new Date() > expiryDate ? 'deal-expired' : '';

        // Create the container
        const dealDetailsElement = createDealDetailsTemplate(className);

        // SAFELY inject the data using textContent
        // This treats the data as plain text, preventing script execution
        dealDetailsElement.querySelector(
            '.deal-details__coupon-detail__name',
        ).textContent = dealObj.label;

        const expiredInElement = dealDetailsElement.querySelector(
            '.deal-details__coupon-detail__expired-in',
        );
        expiredInElement.textContent =
            className === 'deal-expired' ? 'Deal expired' : validFor;

        dealDetailsElement.querySelector(
            '.deal-details__code-section__coupon-code',
        ).textContent = dealObj.promoCode;

        // Append to the DOM
        displayDealsSection.appendChild(dealDetailsElement);
    });
}
/**
 * Calculates a new date by adding a specified number of days to a given date.
 * Does not modify the original date object.
 *
 * @function addDays
 * @param {Date} date
 * @param {string|number} days - The number of days to add. Will be parsed to an integer.
 * @returns {Date} A new Date object representing the calculated future date.
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + parseInt(days));
    return result;
}
/**
 * valid if num is number or not
 * @function validateNumber
 * @param {any} num
 * @returns {boolean} return true if num if number else return false
 */
function validateNumber(num) {
    if (num == '' || num == null || num == undefined || isNaN(num)) {
        return false;
    }
    return true;
}

/**  Function for spinning the wheel and calculating the reward which the user will get, and push that reward into dealsWon array
 * @return {null}
 */
function spinWheel() {
    displayDealWon.style.visibility = 'hidden';
    if (initialDealsLoaded) {
        initialDealsLoaded = false; // if the deals are already fresh in the wheel then no need to load the deals again
    } else {
        dealsLoaded = loadDealsInWheel(); // if the wheel spins again this will load the fresh deals in the wheel again
    }
    const wheel = document.querySelector('.spin-wheel__circle');
    wheel.style.transition = '';
    wheel.style.transform = `rotate(${alreadySpin}deg)`;
    alreadySpin += 360 * 8; // Base rotations to ensure it spins more
    const randomDeg = Math.floor(Math.random() * 360);

    let finalRotation = alreadySpin + randomDeg;

    // to avoid stopping the wheel on edge
    if (finalRotation % 90 === 0) {
        finalRotation += 10;
        alreadySpin += 10;
    }
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    spinBtn.disabled = true;

    const quad = Math.floor((finalRotation % 360) / 90) + 1;
    const wonIndex = quad - 1;
    let dealWon = null; // dealWON object
    dealsLoaded.forEach((dealObj, index) => {
        if (dealObj == null) {
            // No deal available
        } else if (index === wonIndex) {
            dealWon = structuredClone(dealObj);
            dealWon.validFrom = new Date();
            if (!validateNumber(dealWon.validFor)) {
                dealWon.validFor = '7';
            }
            dealsWon.push(dealWon); // deal that user won on spinning the wheel push that to dealsWon array
        } else {
            dealsData.push(dealObj); // deals that have not won yet but still are loaded in wheel push them back to the deals data to unsure randomness
        }
    });
    dealsLoaded = []; // empty the deals that are loaded in wheel

    setTimeout(() => {
        spinBtn.disabled = false;
        // logic to show the details of the deal won to user
        if (dealWon) {
            displayDealWon.style.visibility = 'visible';
            displayDealWon.querySelector(
                '.deal-details__coupon-detail__name',
            ).textContent = dealWon.label;
            displayDealWon.querySelector(
                '.deal-details__coupon-detail__expired-in',
            ).textContent = `Expires in ${dealWon.validFor}d`;
            displayDealWon.querySelector(
                '.deal-details__code-section__coupon-code',
            ).textContent = dealWon.promoCode;
        }
        // logic to display the total number of deals won in "view all unlocked deals" section
        document.querySelector('.deals-navigation-btn__count').textContent =
            dealsWon.length;
        dealsWon.sort((a, b) => {
            const expiryA = addDays(a.validFrom, a.validFor);
            const expiryB = addDays(b.validFrom, b.validFor);
            return expiryA - expiryB;
        });
        renderUnlockedDeals(dealsWon);
    }, 5000);
}

/**
 * Attaches a click event listener to the specified section to handle coupon copying via event delegation.
 * Copies the coupon code to the clipboard only if the clicked element is a copy button
 * and the deal is not expired.
 *
 * @param {HTMLElement} displaySection - The parent HTML element containing the deal details and copy buttons.
 * @returns {void}
 */
function copyCoupon(displaySection) {
    displaySection.addEventListener('click', (e) => {
        const btn = e.target;
        if (
            btn.classList.contains('deal-details__code-section__copy-btn') &&
            !btn.parentElement.parentElement.classList.contains('deal-expired')
        ) {
            // Target the immediate sibling element before the button
            const codeElement = btn.previousElementSibling;
            if (codeElement) {
                const code = codeElement.textContent.trim();
                navigator.clipboard.writeText(code);
            }
        }
    });
}
// To copy coupon code for view all unlocked deals section
copyCoupon(displayDealsSection);
// To copy coupon code for spin and win section
copyCoupon(dealDetails);

/**
 * Traps the focus control inside the section
 * @function trapControl
 * @param {object} event
 * @param {HTMLElement} section - section in which the focus should be trapped
 * @param {HTMLElement} first - first button in the section
 * @param {HTMLElement} last  - last button in the section
 * @returns {void}
 */
function trapControl(event, section, first, last) {
    if (section.style.display !== 'none') {
        const current = document.activeElement;
        if (event.shiftKey && current === first) {
            event.preventDefault();
            last?.focus();
            return;
        }

        if (current === last) {
            if (event.key === 'Tab' && event.shiftKey) {
                return;
            }
            event.preventDefault();
            first.focus();
        }
    }
}
document.addEventListener('keydown', (event) => {
    // Close navmenu on Escape
    if (event.key === 'Escape' && dealsModal.style.display === 'block') {
        document.body.style.overflow = '';
        dealsModal.style.display = 'none';
        return;
    }
    if (event.key === 'Tab' && dealsModal.style.display === 'block') {
        trapControl(
            event,
            specialDealsSection,
            specialDealsCloseBtn,
            viewUnlockDealsBtn,
        );
        trapControl(
            event,
            unlockedDealsSection,
            unlockedDealsCloseBtn,
            backToSpecialDealsBtn,
        );
    }
});
