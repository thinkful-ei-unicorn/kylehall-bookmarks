import $ from 'jquery';

import './style.css';

import bookmarkList from './bookmark-list';
import store from './store';
import api from './api';

let main = () => {
  api.getBookmarks().then((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    bookmarkList.render();
  });
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);
