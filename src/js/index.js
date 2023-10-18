
import GetPicturesFromApi from './dt-api';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';
import anime from 'animejs/lib/anime.es.js';
var throttle = require('lodash.throttle');

const getPicturesApi = new GetPicturesFromApi();

Fancybox.bind("[data-fancybox]");

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonUp = document.querySelector('.up-btn');
const endText = document.querySelector('.end');
endText.classList.add('is-hidden');
buttonUp.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
    try{
    e.preventDefault();
    endText.classList.add('is-hidden');
    getPicturesApi.query = e.target.elements.searchQuery.value;
    if(getPicturesApi.query === '' || getPicturesApi.query === ' ' || getPicturesApi.query === '  ' || getPicturesApi.query === '   ')
     {return Notify.warning('Incorrect input data!!!');}
    clearMarkup();
         getPicturesApi.resetPage();
   await getPicturesApi.getPictures().then(r => {
    if(r.totalHits > 0 && r.totalHits < 40) {
        endText.classList.remove('is-hidden');
    } else {endText.classList.add('is-hidden');};
        Notify.info(`Hooray! We found ${r.totalHits} images.`);
        return r.hits;}).then(data => {const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        anime({
            targets: '.photo-card',
            translateY: [300, 0],
            opacity: [0, 1],
            duration: 2000,
            delay: 500
});
        window.addEventListener('scroll', throttle((onScroll), 1000));
    })} catch(e) {};
};

async function onShow() {
    try {
   await getPicturesApi.getPictures().then(r => {
    if(r.totalHits > 0) {
        endText.classList.remove('is-hidden');
    }
   return r.hits}).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        anime({
            targets: '.photo-card',
            translateY: [150, 0],
            duration: 2000,
});
    })} catch(e) {};
};
function clearMarkup() {
    gallery.innerHTML = '';
};

function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 900) {
       onShow();
    } else if (scrollY > 500) {
        buttonUp.classList.remove('is-hidden');
    } else if (scrollY <= 500) {
        buttonUp.classList.add('is-hidden');
    }
};