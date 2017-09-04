/* eslint-disable camelcase */
import { createSelector } from 'reselect';

export const getAsPath = state => state.router.asPath;
export const getQuery = state => state.router.query;
export const getPathname = state => state.router.pathname;

export const getType = createSelector(
  getQuery,
  query => {
    const { p, page_id, cat, tag, author, s, attachment_id } = query;
    if (p) return 'post';
    else if (page_id) return 'page';
    else if (cat) return 'category';
    else if (tag) return 'tag';
    else if (author) return 'author';
    else if (s) return 'search';
    else if (attachment_id) return 'media';
    return 'latest';
  }
);

export const getId = createSelector(
  getQuery,
  query => {
    const { p, page_id, cat, tag, author, s, attachment_id } = query;
    if (p) return parseInt(p, 10);
    else if (page_id) return parseInt(page_id, 10);
    else if (cat) return parseInt(cat, 10);
    else if (tag) return parseInt(tag, 10);
    else if (author) return parseInt(author, 10);
    else if (s) return s;
    else if (attachment_id) return parseInt(attachment_id, 10);
    return 0;
  }
);
