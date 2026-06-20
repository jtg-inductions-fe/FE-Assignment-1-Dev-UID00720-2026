const hamburger=document.querySelector('#hamburger');
const navMenu=document.querySelector('.nav-menu');

hamburger.addEventListener('click',()=>{
    navMenu.classList.toggle('show');
});

document.addEventListener('click', (event) => {
    // If menu is open AND click is NOT inside menu AND click is NOT on hamburger
    if (navMenu.classList.contains('show') && 
        !navMenu.contains(event.target) && 
        !hamburger.contains(event.target)) {
      navMenu.classList.remove('show');
    }
});

document.addEventListener('keydown', (event) => {
    // Close on Escape
    if (event.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
});
