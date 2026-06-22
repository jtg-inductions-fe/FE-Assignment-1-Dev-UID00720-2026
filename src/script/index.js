const hamburger=document.querySelector('#hamburger');
const navMenu=document.querySelector('.nav-menu');
const hideMenuBtn=document.querySelector('.hide-menu-btn');
const isMobileQuery = window.matchMedia("(max-width: 430px)");

function getIsMobile() {
    return isMobileQuery.matches;
}

hamburger.addEventListener('click',()=>{
    navMenu.classList.toggle('show');
});

hideMenuBtn.addEventListener('click',()=>{
        navMenu.classList.remove('show');
        return;
});

document.addEventListener('keydown', (event) => {
    // Close on Escape
    if (event.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        return;
    }
    if(event.key==='Tab' && navMenu.classList.contains('show')){
        const current=document.activeElement;
        const isMobile = getIsMobile();
        if(isMobile){
            if (current.classList.contains('last-hamburger-nav-for-mobile')) {
                event.preventDefault();
                hideMenuBtn.focus();
            }
        }
        else if (current.classList.contains('last-hamburger-nav-for-tablet')) {
            event.preventDefault();
            hideMenuBtn.focus();
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