import Splide from '@splidejs/splide';

var elms = document.getElementsByClassName('splide');

for (var i = 0; i < elms.length; i++) {
    new Splide(elms[i], {
        type: 'loop',
        perPage: 1,
        gap: 0,
        padding: 0,
        focus: 'center', // Crucial for centering
        arrows: true,
        pagination: true,
    }).mount();
}

const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('.nav-menu');
const hideMenuBtn = document.querySelector('.nav-menu__menu-btn--hide');
const isMobileQuery = window.matchMedia('(max-width: 430px)');
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
