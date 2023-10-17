
import GetPicturesFromApi from './dt-api';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';
import anime from 'animejs/lib/anime.es.js';

const getPicturesApi = new GetPicturesFromApi();

Fancybox.bind("[data-fancybox]");

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const textEnd = document.querySelector('.end-result');
const buttonUp = document.querySelector('.up-btn');
buttonUp.classList.add('is-hidden');
textEnd.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
    try{
    e.preventDefault();
    getPicturesApi.query = e.target.elements.searchQuery.value;
    if(getPicturesApi.query === '' || getPicturesApi.query === ' ' || getPicturesApi.query === '  ' || getPicturesApi.query === '   ')
     {return Notify.warning('Incorrect input data!!!');}
    clearMarkup();
         getPicturesApi.resetPage();
   await getPicturesApi.getPictures().then(r => {
        Notify.info(`Hooray! We found ${r.totalHits} images.`);
        return r.hits;}).then(data => {const markupPictures =
        data.map(item => createGallery(item));
        textEnd.classList.add('is-hidden');
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        anime({
            targets: '.photo-card',
            translateY: [300, 0],
            opacity: [0, 1],
            duration: 2000,
            delay: 2000
});
        window.addEventListener('scroll', onScroll);
    })} catch(e) {};
};

async function onShow() {
    try {
   await getPicturesApi.getPictures().then(r => r.hits).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        anime({
            targets: '.photo-card',
            translateY: [300, 0],
            opacity: [0, 1],
            duration: 4000,
            delay: 1000
});
    })} catch(e) {};
    textEnd.classList.remove('is-hidden')
};

function clearMarkup() {
    gallery.innerHTML = '';
};

function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 200) {
       onShow();
    } else if (scrollY > 500) {
        buttonUp.classList.remove('is-hidden');
    } else if (scrollY <= 500) {
        buttonUp.classList.add('is-hidden');
    }
};