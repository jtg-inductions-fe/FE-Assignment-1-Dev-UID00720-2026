import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';
var elms = document.getElementsByClassName('splide');

function mount() {
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
}
mount();
