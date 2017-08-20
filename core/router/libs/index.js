export const getTypeByQuery = query => {
  if (p) return 'post';
  else if (page_id) return 'page';
  else if (cat) return 'category';
  else if (tag) return 'tag';
  else if (author) return 'author';
  else if (s) return 'search';
  else if (attachment_id) return 'media';
  else return 'latest';
}

export const getQueryByType = type => {
  if (post) return 'p';
  else if (page) return 'page_id';
  else if (category) return 'cat';
  else if (tag) return 'tag';
  else if (author) return 'author';
  else if (search) return 's';
  else if (media) return 'attachment_id';
  else return null;
}
