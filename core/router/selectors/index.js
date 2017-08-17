import { createSelector } from 'reselect';

export const getAsPath = state => state.router.asPath;
export const getQuery = state => state.router.query;
export const getPathname = state => state.router.pathname;

export const getType = createSelector(
  getQuery,
  query => {
    const { post, page, category, tag, author, search, media } = query;
    if (post) return 'post';
    else if (page) return 'page';
    else if (category) return 'category';
    else if (tag) return 'tag';
    else if (author) return 'author';
    else if (search) return 'search';
    else if (media) return 'media';
    else return 'latest';
  }
);

export const getId = createSelector(
  getQuery,
  query => {
    const { post, page, category, tag, author, search, media } = query;
    if (post) return parseInt(post);
    else if (page) return parseInt(page);
    else if (category) return parseInt(category);
    else if (tag) return parseInt(tag);
    else if (author) return parseInt(author);
    else if (search) return parseInt(search);
    else if (media) return parseInt(media);
    else return 0;
    }
);
