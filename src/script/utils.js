const hamburger = document.querySelector('#hamburger');
export function setMenuOpen(isOpen) {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen.toString());
}
