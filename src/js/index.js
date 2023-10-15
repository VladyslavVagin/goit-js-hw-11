
import GetPicturesFromApi from './dt-api';
import '../css/style.css';
import { Notify } from 'notiflix';
import { createGallery } from './markup';
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";

const getPicturesApi = new GetPicturesFromApi();
let galleryPictures = new SimpleLightbox('.gallery a');

const searchForm = document.querySelector('#search-form');
const sendButton = document.querySelector('[type=submit]');
const showMore = document.querySelector('.show-more');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);
showMore.addEventListener('click', onShow);

function onSearch(e) {
    e.preventDefault();
    getPicturesApi.query = e.target.elements.searchQuery.value;
    if(getPicturesApi.query === '') {
      Notify.warning('Incorrect input data!!!');
    }
    clearMarkup();
    getPicturesApi.resetPage();
    getPicturesApi.getPictures().then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    });
}

function onShow() {
    getPicturesApi.getPictures().then(data => { const markupPictures =
        data.map(item => createGallery(item));
        gallery.insertAdjacentHTML('beforeend', markupPictures.join(''));
    });
};

function clearMarkup() {
    gallery.innerHTML = '';
};