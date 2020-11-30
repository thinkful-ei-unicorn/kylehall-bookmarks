let bookmarks = [];
let adding = false;
let error = null;
let filter = false;
let filteredBookmarks = [];

let addBookmark = function (bookmark) {
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i]) {
      bookmarks[i].expand = false;
    }
  }
  bookmarks.push(bookmark);
  this.adding = false;
};

let expandBookmark = function (id) {
  let expandedBookmark = bookmarks.find((bookmark) => bookmark.id === id);
  if (expandedBookmark.expand) {
    expandedBookmark.expand = false;
  } else {
    expandedBookmark.expand = true;
  }
};

let deleteBookmark = function (id) {
  this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
};

let setAdding = function (param) {
  this.adding = param;
};

let filterBookmarks = function (filterNumber) {
  this.filter = true;
  this.bookmarks.forEach((bookmark) => {
    if (bookmark.rating >= filterNumber) {
      this.filteredBookmarks.push(bookmark);
    }
  });
};

let setFiltering = function (param) {
  this.filter = param;
};

let setError = function (errorMessage) {
  this.error = errorMessage;
};

export default {
  bookmarks,
  adding,
  error,
  filter,
  addBookmark,
  expandBookmark,
  deleteBookmark,
  setAdding,
  setFiltering,
  filterBookmarks,
  filteredBookmarks,
  setError,
};
