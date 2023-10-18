// IMPORTS SOME LIBRARIES FOR USE HERE
import axios from "axios";
import { Notify } from 'notiflix';

const endText = document.querySelector('.end');
// MAKE DEFAULT CLASS 
export default class GetPicturesFromApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  // FUNCTION FOR CREATION API REQUESTS 
  async getPictures() {
    const response = await axios({
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
    })
       this.page += 1;
      if( response.data.totalHits === 0) {
         endText.classList.add('is-hidden');
        throw new Error(Notify.failure("Sorry, there are no images matching your search query. Please try again."));
      }
      return response.data;
    }

  // SOME USEFUL FUNCTIONS 
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