
import GetPicturesFromApi from './dt-api';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';

const getPicturesApi = new GetPicturesFromApi();

Fancybox.bind("[data-fancybox]");

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const textEnd = document.querySelector('.end-result');
textEnd.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    getPicturesApi.query = e.target.elements.searchQuery.value;
    if(getPicturesApi.query === '') {
     return Notify.warning('Incorrect input data!!!');
    }
    clearMarkup();
    getPicturesApi.resetPage();
    getPicturesApi.getPictures().then(r => {
        Notify.info(`Hooray! We found ${r.totalHits} images.`);
        return r.hits;}).then(data => {const markupPictures =
        data.map(item => createGallery(item));
        textEnd.classList.add('is-hidden');
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
        window.addEventListener('scroll', onScroll);
    }).catch(() => {});
};

function onShow() {
    getPicturesApi.getPictures().then(r => r.hits).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    }).catch(() => {}).finally(textEnd.classList.remove('is-hidden'));
};

function clearMarkup() {
    gallery.innerHTML = '';
};

function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 100) {
       onShow();
    } 
};