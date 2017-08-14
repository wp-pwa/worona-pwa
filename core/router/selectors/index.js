import { createSelector } from 'reselect';

export const getAsPath = state => state.router.asPath;
export const getQuery = state => state.router.query;
export const getPathname = state => state.router.pathname;

export const getType = createSelector(
  getQuery,
  query => {
    const { p, cat, tag, author, page_id, s, attachment_id } = query;
    if (p) return 'p';
    else if (cat) return 'cat';
    else if (tag) return 'tag';
    else if (author) return 'author';
    else if (page_id) return 'page_id';
    else if (s) return 's';
    else if (attachment_id) return 'attachment_id';
    else return 'latest_posts';
    }
);

export const getId = createSelector(
  getQuery,
  query => {
    const { p, cat, tag, author, page_id, s, attachment_id } = query;
    if (p) return p;
    else if (cat) return cat;
    else if (tag) return tag;
    else if (author) return author;
    else if (page_id) return page_id;
    else if (s) return s;
    else if (attachment_id) return attachment_id;
    else return 0;
    }
);
