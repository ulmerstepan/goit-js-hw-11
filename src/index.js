import './css/styles.css';
import PicturesApiService from './pixabay-api';
import galleryTmpt from './templates/gallery-markup.hbs';
import { Notify } from 'notiflix';
import throttle from 'lodash/throttle';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    inputForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
};

const picturesApiService = new PicturesApiService();

refs.inputForm.addEventListener('submit', onFormSubmit);


function onFormSubmit(evt) {
    evt.preventDefault();

    picturesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;

    if (picturesApiService.searchQuery === '') {
        return Notify.failure('enter your request!');
    }

    picturesApiService.resetPage();
    clearContainer();
    fetchQuery();

    window.addEventListener('scroll', throttle(loadMorePictures, 500));
}


function fetchQuery() {
    picturesApiService.fetchPictures().then(data => {
        if (data.totalHits === 0) {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again');
        }
        Notify.success(`Hooray! We found ${data.total} images`);
        renderGallaryMarkup(data);
    })
}


function loadMorePictures() {

    if ((window.scrollY + window.innerHeight) > (document.documentElement.scrollHeight - 300)) {

        picturesApiService.fetchPictures().then(data => {
            if (data.hits.length === 0) {
                window.removeEventListener('scroll', throttle(loadMorePictures, 500));
                return Notify.warning("That's it! You've reached the end of search results");
            }
            renderGallaryMarkup(data);

        })
        
    }
}


function renderGallaryMarkup(data) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', galleryTmpt(data.hits));
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}


function clearContainer() {
    refs.galleryContainer.innerHTML = '';
}
