import $ from 'jquery';
import api from './api';
import STORE from './store';

let getBookmarkIdFromElement = function (targetElement) {
  return $(targetElement)
    .closest('.js-bookmark-condensed-container')
    .data('item-id');
};

let generateRating = (bookmark) => {
  let starRating;
  let starChecked = bookmark.rating;
  let starUnchecked = 5 - starChecked;
  let starCheckedHtml = '<span class="fa fa-star checked"></span>';
  let starUncheckedHtml = '<span class="fa fa-star"></span>';
  starRating =
    starCheckedHtml.repeat(starChecked) +
    starUncheckedHtml.repeat(starUnchecked);
  return starRating;
};

let generateBookMarkHtml = (bookmark) => {
  let bookmarkExpand = !bookmark.expand ? 'bookmark-hide' : '';
  let bookmarkRating = generateRating(bookmark);
  return `
      <div class="bookmark-condensed-container js-bookmark-condensed-container" data-item-id="${bookmark.id}">
        <button class="expand-button js-expand-button">↔</button>  
        <h2 class="bookmark-name js-bookmark-name">${bookmark.title}</h2>
        <div class="bookmark-rating js-bookmark-rating">
          ${bookmarkRating}
        </div>
        <div class="bookmark-expand js-bookmark-expand-container ${bookmarkExpand}">
          <p>${bookmark.desc}</p>
          <div class="actions">
            <a class="bookmark-URL js-bookmark-URL" href=${bookmark.url} target="_blank">Visit the site here</a>
            <button class="delete-button js-delete-button">Delete</button>
          </div>
        </div>
      </div>
    `;
};

let joinBookmarks = (bookmarks) => {
  let bookmarksHtml = bookmarks.map((bookmark) =>
    generateBookMarkHtml(bookmark)
  );
  return bookmarksHtml.join('');
};

let generateBookmarkHeader = () => {
  $('#main').html(`    
    
    <h1>Simple Bookmark</h1>
    <div class="main-container" role="main">
      <div class="flex-container">
        <section class="user-controls">
          <button class="button-add js-button-add">+Add</button>
          <div class="filter-container">
            <label for="star-rating-filter">Filter by:</label>
            <select name="star-rating" id="star-rating-filter">
              <option value="0">minimum rating</option>
              <option value="5">5+ stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
              <option value="1">see all</option>
            </div>
          </select>
        </section>
        <section class="bookmark-container js-bookmark-container">
        </section>
      </div>
    </div>`);
};

let generateAdd = function () {
  return `
<div class="add-bookmark-container">
<form class="add-bookmark-form"> 
    <label class="form" for="title">Title:</label><br>
    <input type="text" id="title" name="title" required><br>
    <div class"bookmark-hide" role="radiogroup" aria-labelledby="rating">
      <label class="form" id="rating">Rating:</label><br>
      <label class="bookmark-hide" for="rating5">5 stars</label>
      <input type="radio" name="rating" id="rating5" value="5" checked>5 stars<br>
      <label class="bookmark-hide" for="rating4">4 stars</label>
      <input type="radio" name="rating" id="rating4" value="4">4 stars<br>
      <label class="bookmark-hide" for="rating3">3 stars</label>
      <input type="radio" name="rating" id="rating3" value="3">3 stars<br>
      <label class="bookmark-hide" for="rating2">2 stars</label>
      <input type="radio" name="rating" id="rating2" value="2">2 stars<br>
      <label class="bookmark-hide" for="rating1">1 star</label>
      <input type="radio" name="rating" id="rating1" value="1">1 star<br>
    </div>
    <lable class="form">Description:<br>
      <textarea name="desc" id="bookmark-description" cols="100" rows="10" ></textarea>
    </lable><br>
    <label class="form" for="url">Bookmark URL:</label><br>
    <input type="url" name="url" id="url" placeholder="URL should include: https://"required><br>
    <div class="actions">
      <input type="submit" value="Submit">
      <input type="reset" value="Reset"> 
      <input type="button" value="Cancel" class="js-cancel-button">
    </div>
</form>
</div>
`;
};

let generateError = function (errorMessage) {
  return `
    <!-- ERROR DISPLAY -->
    <div class="error-container js-error-container">
      <button id="cancel-error">X</button>
      <h2>ERROR!</h2>
      <p>${errorMessage}</p>
    </div>
    `;
};

let renderClose = function () {
  $('.js-error-container').remove();
};

let renderError = function () {
  if (STORE.error) {
    if (STORE.adding) {
      let errorMessage = generateError(STORE.error);
      $('.flex-container').after(errorMessage);
    } else if (!STORE.adding) {
      let errorMessage = generateError(STORE.error);
      $('.user-controls').after(errorMessage);
    }
  } else {
    $('.js-error-container').empty();
  }
};

let serializeJson = function (form) {
  let formData = new FormData(form);
  let o = {};
  formData.forEach((val, name) => (o[name] = val));
  return JSON.stringify(o);
};

let handleBookMarkAdd = function () {
  $('#main').on('click', '.js-button-add', function () {
    //console.log('add button was clicked')
    if (!STORE.adding) {
      STORE.adding = true;
    }
    render();
  });
};

let handleBookmarkSubmit = function () {
  $('.add-bookmark-form').submit(function (event) {
    event.preventDefault();

    let formElement = $('.add-bookmark-form')[0];
    let jsonObj = serializeJson(formElement);

    api
      .createBookmark(jsonObj)
      .then((newBookMark) => {
        STORE.addBookmark(newBookMark);
        render();
      })
      .catch((e) => {
        STORE.setError(e.message);
        renderError();
        render();
      });
  });
};

let render = function () {
  $('#main').html(generateBookmarkHeader());

  if (STORE.adding) {
    $('.user-controls').toggleClass('bookmark-hide');
    $('.js-error-container-main').toggleClass('bookmark-hide');
    $('.js-bookmark-container').html(generateAdd());
    renderError();
    bindEventListeners();
  } else if (STORE.filter) {
    let bookmarksFilteredCopy = [...STORE.filteredBookmarks];
    let bookmarkFilteredHtml = joinBookmarks(bookmarksFilteredCopy);
    $('.js-bookmark-container').html(bookmarkFilteredHtml);
    renderError();
    STORE.filteredBookmarks = [];
    bindEventListeners();
  } else {
    let bookmarkHtml = joinBookmarks(STORE.bookmarks);
    $('.js-bookmark-container').html(bookmarkHtml);
    renderError();
    bindEventListeners();
  }
};

let handleBookmarkExpand = function () {
  $('.js-bookmark-container').on('click', '.js-expand-button', (e) => {
    let id = getBookmarkIdFromElement(e.currentTarget);
    STORE.expandBookmark(id);
    render();
  });
};

let handleDelete = function () {
  $('.js-delete-button').on('click', (e) => {
    let id = $(e.currentTarget).parent().parent().parent().data('item-id');
    api
      .deleteBookmark(id)
      .then(() => {
        STORE.deleteBookmark(id);
        render();
      })
      .catch((e) => {
        STORE.setError(e.message);
        renderError();
      });
  });
};

let handleErrorClose = function () {
  $('.flex-container').on('click', '#cancel-error', () => {
    renderClose();
    STORE.setError(null);
  });
};

let handleCancelClick = function () {
  $('.js-cancel-button').on('click', function () {
    STORE.setAdding(false);
    render();
  });
};

let handleFilterClick = function () {
  $('#star-rating-filter').change(() => {
    let filterParam = $('#star-rating-filter').val();
    console.log('rating:', filterParam);
    STORE.filterBookmarks(filterParam);
    render();
  });
};

let bindEventListeners = function () {
  handleErrorClose();
  handleFilterClick();
  handleCancelClick();
  handleDelete();
  handleBookmarkExpand();
  handleBookMarkAdd();
  handleBookmarkSubmit();
};

export default {
  bindEventListeners,
  render,
};
