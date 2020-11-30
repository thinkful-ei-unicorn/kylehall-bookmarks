let baseURL = 'https://thinkful-list-api.herokuapp.com/kyle';

function listApiFetch(...args) {
  let error;
  return fetch(...args)
    .then((res) => {
      if (!res.ok) {
        // Valid HTTP response but non-2xx status - let's create an error!
        error = {
          code: res.status,
        };
      }

      // In either case, parse the JSON stream:
      return res.json();
    })
    .then((data) => {
      // If error was flagged, reject the Promise with the error object
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      // Otherwise give back the data as resolved Promise
      return data;
    });
}

let getBookmarks = function () {
  return fetch(`${baseURL}/bookmarks`);
};

let createBookmark = function (obj) {
  let newBookmark = obj;
  console.log('newbookmark:', newBookmark);
  let options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: newBookmark,
  };

  return listApiFetch(baseURL + '/bookmarks', options);
};

let deleteBookmark = function (objId) {
  let options = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
  };
  return listApiFetch(baseURL + '/bookmarks/' + objId, options);
};

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark,
};
