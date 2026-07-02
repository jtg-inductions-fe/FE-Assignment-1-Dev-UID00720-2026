import * as Constants from './constants';
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('.nav-menu');
const hideMenuBtn = document.querySelector('.nav-menu__menu-btn--hide');
const isMobileQuery = window.matchMedia(
    `(max-width: ${Constants.mobileWidth})`,
);
const linksArrows = document.querySelectorAll('.links-arrow');

/**
 * Checks if the current viewport matches the mobile media query (max-width: 430px).
 * @returns {boolean} True if the viewport is mobile, false otherwise.
 */
function getIsMobile() {
    return isMobileQuery.matches;
}

/**
 * Toggles the visibility of the navigation menu and manages body scroll behavior.
 * - Adds/removes the 'show' class to the nav menu.
 * - Sets body overflow to 'hidden' when open to prevent background scrolling.
 *
 * @param {boolean} isOpen - True to open the menu, false to close it.
 */
function setMenuOpen(isOpen) {
    navMenu.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen.toString());
}

hamburger.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('show'));
});

hideMenuBtn.addEventListener('click', (event) => {
    event.preventDefault();
    setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
    // Close navmenu on Escape
    if (event.key === 'Escape' && navMenu.classList.contains('show')) {
        setMenuOpen(false);
        return;
    }

    if (event.key === 'Tab' && navMenu.classList.contains('show')) {
        const current = document.activeElement;
        const first = hideMenuBtn;
        const isMobile = getIsMobile();
        const lastSelector = isMobile
            ? '.last-hamburger-nav-for-mobile'
            : '.last-hamburger-nav-for-tablet';
        const last = navMenu.querySelector(lastSelector);

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
});

/**
 * Attaches click event listeners to footer arrows to toggle the visibility of mobile nav links.
 * When an arrow is clicked, it finds the corresponding nav links within the same section
 * and toggles the 'show-footer-navs' class.
 *
 * @returns {void}
 */
function openFooterLinks() {
    for (let linksArrow of linksArrows) {
        linksArrow.addEventListener('click', () => {
            const navLinks = linksArrow
                .closest('.footer-links-section')
                .querySelector('.footer-links-section__nav-links');
            navLinks.classList.toggle('show-footer-navs');
        });
    }
}
openFooterLinks();

// --------------------------------------------------------------logics for spin wheel modal-------------------------------------------------------------
const specialDealsOpenBtn = document.querySelector('.special-deals-btn');
const specialDealsModal = document.querySelector('.deals-modal');
const specialDealsCloseBtn = document.querySelector(
    '.deals-modal__special-deals__close-btn',
);
const spinBtn = document.querySelector('.spin-wheel__circle__spin-btn');

specialDealsOpenBtn.addEventListener('click', () => {
    setMenuOpen(false);
    document.body.style.overflow = 'hidden';
    specialDealsModal.style.display = 'block';
});

specialDealsCloseBtn.addEventListener('click', () => {
    document.body.style.overflow = '';
    specialDealsModal.style.display = 'none';
});

let dealsData = [
    {
        label: '20% Off Flights',
        promoCode: 'FLY20-X8J2',
        validFor: 13,
    },
    {
        label: 'Free Hotel Night',
        promoCode: 'HOTEL-9A4B',
        validFor: null,
    },
    {
        label: '10% Off Packages',
        promoCode: 'PKG10-QW12',
        validFor: 4,
    },
    {
        label: 'VIP Lounge',
        promoCode: 'VIP-LMN9',
        validFor: 29,
    },
    {
        label: 'Free Breakfast',
        promoCode: 'BFAST-5541',
        validFor: 1,
    },
    {
        label: 'Free Airport Cab',
        promoCode: 'CAB-XYZ9',
        validFor: 6,
    },
    {
        label: '15% Off Car Rentals',
        promoCode: 'CAR15-JKL3',
        validFor: 14,
    },
    {
        label: 'Buy 1 Get 1 City Tour',
        promoCode: 'BOGO-TR44',
        validFor: 10,
    },
    {
        label: 'Complimentary Spa Session',
        promoCode: 'SPA-ZXC8',
        validFor: 21,
    },
    {
        label: 'Priority Boarding',
        promoCode: 'PRI-BOARD1',
        validFor: null,
    },
];
const displayDealWon = document.querySelector('.deal-won');
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

//this is the initial loaded deals when the component render
let dealsLoaded = loadDealsInWheel(); // deals that are already loaded in the wheel and removed from the dealsData
let initialDealsLoaded = true; // this will be become false after the wheel has spinned one time
let dealsWon = [];

let alreadySpin = 0; // to how much degree has the wheel already spined
// Function for spinning the wheel and calculating the reward which the user will get.
function spinWheel() {
    displayDealWon.style.display = 'none';
    if (initialDealsLoaded) {
        initialDealsLoaded = false; // if the deals are already fresh in the wheel then no need to load the deals again
    } else {
        dealsLoaded = loadDealsInWheel(); // if the wheel spins again this will load the fresh deals in the wheel again
    }
    const wheel = document.querySelector('.spin-wheel__circle');
    wheel.style.transition = '';
    wheel.style.transform = `rotate(${alreadySpin}deg)`;
    alreadySpin += 360 * 8; // Base rotations to ensure it spins more
    const randomDeg = Math.floor(Math.random() * (350 - 10 + 1)) + 10;

    const finalRotation = alreadySpin + randomDeg;
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    spinBtn.disabled = true;

    const quad = Math.floor((finalRotation % 360) / 90) + 1;
    let dealWonLabel = document
        .querySelector(`.prize${quad}`)
        .querySelector('p').textContent; // Label of the deal that we won
    let dealWon = null; // dealWON object
    dealsLoaded.forEach((dealObj) => {
        if (dealObj == null) {
            // No deal available
        } else if (dealObj.label === dealWonLabel) {
            dealWon = dealObj;
            dealsWon.push(dealObj); // deal that user won on spinning the wheel push that to dealsWon array
        } else {
            dealsData.push(dealObj); // deals that have not won yet but still are loaded in wheel push them back to the deals data to unsure randomness
        }
    });
    dealsLoaded = []; // empty the deals that are loaded in wheel

    setTimeout(() => {
        spinBtn.disabled = false;
        displayDealWon.style.display = 'block';

        // logic to show the details of the deal won to user
        displayDealWon.querySelector(
            '.deal-details__coupon-detail__name',
        ).textContent = dealWon.label;
        if (dealWon.validFor) {
            displayDealWon.querySelector(
                '.deal-details__coupon-detail__expired-in',
            ).textContent = `Expires in ${dealWon.validFor}d`;
        }
        displayDealWon.querySelector(
            '.deal-details__code-section__coupon-code',
        ).textContent = dealWon.promoCode;

        // logic to display the total number of deals won in "view all unlocked deals" section
        document.querySelector('.view-unlock-deals__count').textContent =
            dealsWon.length;
    }, 5000);
}
spinBtn.addEventListener('click', spinWheel);

// function for coupon code component for coping the coupon code into the clipboard after clicking on copy button
const handleClick = (e) => {
    copyCouponFunction(e.currentTarget);
};
function copyCouponFunction(btn) {
    // Target the immediate sibling element before the button
    const codeElement = btn.previousElementSibling;

    if (codeElement) {
        const code = codeElement.innerText || codeElement.textContent;
        navigator.clipboard.writeText(code);
    }
}
function initCouponCopy() {
    // Select all copy buttons with the specific class
    const copyButtons = document.querySelectorAll(
        '.deal-details__code-section__copy-btn',
    );

    copyButtons.forEach((btn) => {
        btn.addEventListener('click', handleClick);
    });
}
initCouponCopy();
