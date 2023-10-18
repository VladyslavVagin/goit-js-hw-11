
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
});        console.log(data.length);
          if (data.length === getPicturesApi.per_page) { 
            window.addEventListener('scroll', throttle((onScroll), 700));
        } else {
            window.removeEventListener('scroll');
        }
    })} catch(e) {};
};

async function onShow() {
    try {
   await getPicturesApi.getPictures().then(r => {
    if(r.hits.length === 0) {
        endText.classList.remove('is-hidden');
        throw new Error();
    }
   return r.hits}).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        anime({
            targets: '.photo-card',
            translateY: [250, 0],
            duration: 3000,
});
    })} catch(e) {};
};
function clearMarkup() {
    gallery.innerHTML = '';
};

function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 1000) {
       onShow();
    } else if (scrollY > 500) {
        buttonUp.classList.remove('is-hidden');
    } else if (scrollY <= 500) {
        buttonUp.classList.add('is-hidden');
    }
};