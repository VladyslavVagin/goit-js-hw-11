
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

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', onScroll);

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
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    }).catch(onError);
};

function onShow() {
    getPicturesApi.getPictures().then(r => {
       if(r.hits.length === 0) {
        const endMarkup = `<p class="end-result">We're sorry, but you've reached the end of search results.</p>`;
        gallery.insertAdjacentHTML('beforeend', endMarkup);
       }
       return r.hits;}).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    }).catch(onError);
};

function clearMarkup() {
    gallery.innerHTML = '';
};

function onError() {
  Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function onScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if(documentRect.bottom < document.documentElement.clientHeight + 100) {
       onShow();
    } 
};
function ifCompletePictures() {
    const endMarkup = `<p class="end-result">We're sorry, but you've reached the end of search results.</p>`;
    gallery.insertAdjacentHTML('beforeend', endMarkup);
};