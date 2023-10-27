// all IMPORTS OF LIBRARIES AND OTHER JS FILES 
import GetPicturesFromApi from './dt-api';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';
import anime from 'animejs/lib/anime.es.js';
var throttle = require('lodash.throttle');

// CALL CLASS FOR USE IN THIS FILE 
const getPicturesApi = new GetPicturesFromApi();

// LIGHTBOX LIBRARY CALL 
Fancybox.bind("[data-fancybox]");

// MAKE CONST FOR SOME HTML ITEMS 
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonUp = document.querySelector('.up-btn');
const endText = document.querySelector('.end');
const wrapper = document.querySelector('.wrapper');
const openGallery = document.querySelector('.fullscreen-title');

// BUTTON UP AND END TEXT HIDDEN 
endText.classList.add('is-hidden');
buttonUp.classList.add('is-hidden');
searchForm.classList.add('is-hidden');

// ADD EVENT LISTENER TO SEARCH BUTTON 
searchForm.addEventListener('submit', onSearch);
openGallery.addEventListener('click', () => {
    searchForm.classList.remove('is-hidden');
    wrapper.classList.add('hidden')
setTimeout(() => wrapper.classList.add('is-hidden'), 1500);
});

// FUNCTION WHICH WILL CALLING ON SUBMIT SEARCH REQUEST 
 function onSearch(e) {
    e.preventDefault();
    clearMarkup();
    // GET VALUE FROM INPUT 
    getPicturesApi.query = e.target.elements.searchQuery.value;
    if(getPicturesApi.query === '' || getPicturesApi.query === ' ' || getPicturesApi.query === '  ' || getPicturesApi.query === '   ')
     {return Notify.warning('Incorrect input data!!!');}

    // RESET PAGE AND SEND REQUEST TO API 
         getPicturesApi.resetPage();
         getPicturesApi.getPictures().then(r => {

    // IF PICTURES LESS THAN 40 SHOW TEXT TO INFORM USER ABOUT END OF COLLECTION 
    if(r.totalHits > 0 && r.totalHits < 40) {
        endText.classList.remove('is-hidden');
    } else {endText.classList.add('is-hidden');};

    // NOTIFICATION ABOUT QUALITY OF ALL IMAGES THAT WILL BE SHOWN 
        Notify.info(`Hooray! We found ${r.totalHits} images.`);

        // MAKE HTML MARKUP OF FIRST PAGE OF GALLERY 
        return r.hits;}).then(data => {const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        // ANIMATION OF GALLERY 
        anime({
            targets: '.photo-card',
            translateY: [250, 0],
            opacity: [0, 1],
            duration: 2500,
            delay: 1000
});  
       // IF PICTURES ONLY 1 PAGE NOT USE LISTENER FOR SCROLL 
          if (data.length === getPicturesApi.per_page) { 
            window.addEventListener('scroll', throttle((onScroll), 700));
        } else {
            window.removeEventListener('scroll');
            throw new Error();
        }
    }).catch((error) => {})};

// FUNCTION WHICH CALLING DURING SCROLLING AND IF PAGE MORE THAN ONE
 function onShow() {
 getPicturesApi.getPictures().then(r => {
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
            opacity: [0.5, 1],
            duration: 2000,
});
    }).catch((error) => {}).finally(() => {
        // REFRESH GALLERY 
        Fancybox.destroy();
        Fancybox.bind("[data-fancybox]");
    })};

// FUNCTION FOR CLEAR MARKUP OF GALLERY 
function clearMarkup() {
    gallery.innerHTML = '';
    endText.classList.add('is-hidden');
};

// FUNCTION WHICH WILL CALL FOR SCROLL !!! SHE CALL ALSO ADDITIONAL REQUESTS FOR API BY CALLING FN onShow 
function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 1600) {
       onShow();
       endText.classList.remove('is-hidden');
    //    APPEAR AND DISAPPEAR UP-BUTTON 
    } else if (scrollY > 500) {
        buttonUp.classList.remove('is-hidden');
    } else if (scrollY <= 500) {
        buttonUp.classList.add('is-hidden');
    }
};
// ===============================================================================================================