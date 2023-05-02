import axios from 'axios';

const API_KEY = '35866753-ee5e4fb02ae2dcf2727fa9b13';
const BASE_URL = 'https://pixabay.com/api/';

export default class PostsApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
      this.totalHits = 0;
    }
  
    async fetchPost() {
      const OPTIONS = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      });
  
      try {
       
        const response = await axios.get(`${BASE_URL}?${OPTIONS.toString()}`);
        this.incrementPage();
        
        return response.data;
      } catch (error) {
         console.error(error.toJSON());
      }
    }
  
    get query() {
      return this.searchQuery;
    }
  
    set query(newQuery) {
      this.searchQuery = newQuery;
    }
    get hits() {
      return this.totalHits;
    }
  
    set hits(newTotalHits) {
      this.totalHits = newTotalHits;
    }
    incrementPage() {
      this.page += 1;
    }
  
    resetPage() {
      this.page = 1;
    }
  }

