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

// function to open footer nav links in mobile view when drop down arrow is clicked
for (let linksArrow of linksArrows) {
    linksArrow.addEventListener('click', () => {
        const navLinks = linksArrow
            .closest('.footer-links')
            .querySelector('.footer-links__nav-links');
        navLinks.classList.toggle('show-footer-navs');
    });
}
