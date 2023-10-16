import axios from "axios";
import { Notify } from 'notiflix';

export const textEnd = document.querySelector('.end-result');

export default class GetPicturesFromApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  getPictures() {
    return axios({
      url: 'https://pixabay.com/api/',
      params: {
        key: '40026109-900194399c80021c84c1deb9d',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: 40,
      }
    }).then(response => {
      this.page += 1;
      if( response.data.totalHits === 0) {
        throw new Error(Notify.failure("Sorry, there are no images matching your search query. Please try again."));
      } else if(response.data.hits.length === 0) {
        textEnd.classList.remove('is-hidden');
        throw new Error();
      }
      return response.data;
    });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    return this.searchQuery = newQuery;
  }
};