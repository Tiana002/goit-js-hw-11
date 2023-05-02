import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PostApiService from '../post-servise';
import LoadMoreBtn from '../btn-load-more';
import PageLoadStatus from './load-status';
import formSticky from './form-sticky';
import LoadingPoint from './loading-point';
let totalHits = 0;

const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
  
});

const loadingPoint = new LoadingPoint({
  selector: '.loading-point',
});

const pageLoadStatus = new PageLoadStatus({
    selector: '.page-load-status',
  });

const postApiService = new PostApiService();
const lightbox = new SimpleLightbox('.gallery__item', {
    captionDelay: 250,
    captionsData: 'alt',
    enableKeyboard: true,
  });

  const obsOptions = {
    root: null,
    rootMargin: '100px',
    treshold: 1,
  };

const observer = new IntersectionObserver(onLoading, obsOptions);
refs.formSearch.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
window.addEventListener('scroll', formSticky);

function onSearch(e) {
  clearPage(e);
  showLoading();
  postApiService.fetchPost().then(data => {
    handleLoadedPosts(data);
  });
}

 function onLoadMore() {
    pageLoadStatus.show();
    showLoading();
    observer.observe(loadingPoint.refs.loadingPoint);
  }

  function handleLoadedPosts(loadedPostsData){
    totalHits = loadedPostsData.totalHits;
    const currentPage = postApiService.page - 1;

    if (!loadedPostsData.totalHits) {
      loadMoreBtn.hide();
      pageLoadStatus.errorShow();

      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  
      if (!loadedPostsData.hits.length) {
         loadMoreBtn.hide();
        pageLoadStatus.lastElemShow();
        return;
      }
  
      renderPost(loadedPostsData.hits);

      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${loadedPostsData.totalHits} images.`);

        if (loadedPostsData.totalHits > 40) {
        loadMoreBtn.show();
        } else {
          loadMoreBtn.hide();
          showLastElementText();
        }
      } 
      pageLoadStatus.enable();
  }

function renderPost(data) {
  let markupPost = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                        <p class="info-item"><b>Likes</b> ${likes}</p>
                        <p class="info-item"><b>Views</b> ${views}</p>
                        <p class="info-item"><b>Comments</b> ${comments}</p>
                        <p class="info-item"><b>Downloads</b> ${downloads}</p>
                      </div>
                    </div>
                 </a>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markupPost);
  lightbox.refresh();
}

function clearPage(e) {
  e.preventDefault();
  totalHits = 0;
  pageLoadStatus.hide();
  postApiService.query = e.target.searchQuery.value.trim();
  loadMoreBtn.show();
  postApiService.resetPage();
  clearGallery();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function onLoading(entries) {
  if (isLastPage()) {
    showLastElementText();
    return;
  }
    await entries.forEach(entry => {
      if (entry.isIntersecting) {
        showLoading();
        postApiService.fetchPost().then(data => {
          handleLoadedPosts(data);
        });
      }
    });
  }

  function isLastPage () {
    const currentPage = postApiService.page - 1;
    const totalPageCount = calculatePagesCount(40, totalHits);
    return currentPage >= totalPageCount;
  }

  function showLoading(){
    loadMoreBtn.hide();
    pageLoadStatus.loadingShow();
  }

  function showLastElementText(){
    pageLoadStatus.show();
    pageLoadStatus.lastElemShow();
  }

  const calculatePagesCount = (pageSize, totalCount) => {
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};