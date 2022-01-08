import axios from "axios";

const API_KEY = '24782345-074c184871a8ba5a263dbeb7d';
const BASE_URL = `https://pixabay.com/api/`;

export default class PixabayApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchPictures() {
        const searchParametrs = {
            params: {
                key: API_KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: this.page,
                per_page: this.per_page,
            },

        };

        try {
            const response = await axios.get(BASE_URL, searchParametrs);
            const dataReceived = response.data;
            this.incrementPage();
            return dataReceived;
        } catch (error) {
            console.error(error);
        }       
    }


  incrementPage() {
    this.page += 1;
  }
  
  resetPage() {
    this.page = 1;
  }
}