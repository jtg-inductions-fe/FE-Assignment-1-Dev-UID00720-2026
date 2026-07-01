import * as Constants from './constants';
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('.nav-menu');
const hideMenuBtn = document.querySelector('.nav-menu__menu-btn--hide');
const isMobileQuery = window.matchMedia(
    `(max-width: ${Constants.mobileWidth})`,
);
const linksArrows = document.querySelectorAll('.links-arrow');
const footerNavLinks = document.querySelectorAll('.footer-links__nav-links');

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

// function to open footer nav links in mobile view when drop down arrow is clicked
for (let linksArrow of linksArrows) {
    linksArrow.addEventListener('click', () => {
        const companyNavLinks = footerNavLinks[0];
        const contactNavLinks = footerNavLinks[1];
        const meetNavLinks = footerNavLinks[2];
        if (linksArrow.classList.contains('company-down-arrow')) {
            companyNavLinks.classList.toggle('show-footer-navs');
        } else if (linksArrow.classList.contains('contact-down-arrow')) {
            contactNavLinks.classList.toggle('show-footer-navs');
        } else if (linksArrow.classList.contains('meet-down-arrow')) {
            meetNavLinks.classList.toggle('show-footer-navs');
        }
    });
}

const specialDealsOpenBtn = document.querySelector('.special-deals-btn');
const specialDealsModal = document.querySelector('.deals-modal');
const specialDealsCloseBtn = document.querySelector(
    '.deals-modal__special-deals__close-btn',
);

// logics for spin wheel modal
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
let alreadySpin = 0;
spinBtn.addEventListener('click', () => {
    const wheel = document.querySelector('.spin-wheel__circle');
    wheel.style.transition = '';
    wheel.style.transform = `rotate(${alreadySpin}deg)`;
    alreadySpin += 360 * 8; // Base rotations to ensure it spins more
    const randomDeg = Math.floor(Math.random() * 360);
    const finalRotation = alreadySpin + randomDeg;
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotate(${finalRotation}deg)`;
});
