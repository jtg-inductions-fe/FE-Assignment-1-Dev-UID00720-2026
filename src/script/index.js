const hamburger=document.querySelector('#hamburger');
const navMenu=document.querySelector('.nav-menu');
const hideMenuBtn=document.querySelector('.hide-menu-btn');
const isMobileQuery = window.matchMedia("(max-width: 430px)");

function getIsMobile() {
    return isMobileQuery.matches;
}

function setMenuOpen(isOpen) {
    navMenu.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click',()=>{
    setMenuOpen(!navMenu.classList.contains('show'));
});

hideMenuBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
    // Close on Escape
    if (event.key === 'Escape' && navMenu.classList.contains('show')) {
        setMenuOpen(false);
        return;
    }
    if(event.key==='Tab' && navMenu.classList.contains('show')){
        const current=document.activeElement;
        const first = hideMenuBtn;
        const isMobile = getIsMobile();
        const lastSelector = isMobile ? '.last-hamburger-nav-for-mobile' : '.last-hamburger-nav-for-tablet';
        const last = navMenu.querySelector(lastSelector);

        if (event.shiftKey && current === first) {
            event.preventDefault();
            last?.focus();
            return;
        }
        
        if (current === last) {
            if(event.key === "Tab" && event.shiftKey){
                return;
            }
            event.preventDefault();
            first.focus();
        }
    }
});
hamburger.addEventListener('click',()=>{
    if(navMenu.classList.contains('show')){
        document.body.style.overflow='hidden';
    }
});
hideMenuBtn.addEventListener('click',()=>{
    document.body.style.overflow='visible';
});
