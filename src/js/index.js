
import GetPicturesFromApi from './dt-api';
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from 'simplelightbox';

const getPicturesApi = new GetPicturesFromApi();

const searchForm = document.querySelector('#search-form');
const showMore = document.querySelector('.show-more');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);
showMore.addEventListener('click', onShow);

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
    }).catch(onError).finally(creationGalleryPictures);
};

function creationGalleryPictures() {
    new SimpleLightbox('.gallery a');
};

function onShow() {
    getPicturesApi.getPictures().then(r => r.hits).then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    }).catch(onError).finally(creationGalleryPictures);
};

function clearMarkup() {
    gallery.innerHTML = '';
};

function onError() {
  Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};