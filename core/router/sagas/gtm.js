/* eslint-disable no-undef, global window */
import { takeEvery, select, fork, call } from 'redux-saga/effects';
import { dep } from 'worona-deps';

const getUrlAndTitle = query => {
  let url = '';
  let title = '';
  if (query.p) {
    url += `?p=${query.p}`;
    title += `Post - ${query.p}`;
  } else if (query.cat) {
    url += `?cat=${query.cat}`;
    title += `Category - ${query.cat}`;
  } else if (query.tag) {
    url += `?tag=${query.tag}`;
    title += `Tag - ${query.tag}`;
  } else if (query.author) {
    url += `?author=${query.author}`;
    title += `Author - ${query.author}`;
  } else if (query.y || query.m) {
    url += `?m=${query.m}`;
    title += `Archive - ${query.m}`;
  } else if (query.page_id) {
    url += `?page_id=${query.page_id}`;
    title += `Page - ${query.page_id}`;
  } else if (query.s) {
    url += `?s=${query.s}`;
    title += `Search - ${query.s}`;
  } else if (query.attachment_id) {
    url += `?attachment_id=${query.attachment_id}`;
    title += `Attachment - ${query.attachment_id}`;
  } else {
    title += 'Home';
  }
  return { url, title };
};

export function* virtualPageView(customDimValues) {
  const getSetting = dep('settings', 'selectorCreators', 'getSetting');
  const query = yield select(deps('', 'selectors', 'getURLQueries'));
  const siteName = yield select(getSetting('generalSite', 'name'));
  const { url, title } = getUrlAndTitle(query);

  const virtualPage = {
    title: `${siteName} - ${title}`,
    url: `${siteUrl}${url}`,
    customDimValues,
  };
  console.log('SEND VIRTUAL PAGE VIEW', virtualPage);
  window.dataLayer.push({ event: 'virtualPageView', virtualPage });
}

export default function* gtmSagas() {
  window.dataLayer = window.dataLayer || [];

  const getSetting = (namespace, setting) =>
    dep('settings', 'selectorCreators', 'getSetting')(namespace, setting);

  // Getting values for custom dimensions
  const siteId = yield select(getSetting('generalSite', '_id'));
  const userIds = yield select(getSetting('generalSite', 'userIds'));
  const theme = (yield select(getSetting('theme', 'woronaInfo'))).name;
  const extensions = Object.values(yield select(getSetting('theme', 'woronaInfo'))).toString();
  const viewType = /^(pre)?dashboard\./.test(window.location.host) ? 'preview' : 'pwa';
  const plan = 'enterprise';

  const customDimValues = { siteId, userIds, theme, extensions, viewType, plan };
  console.log('CUSTOM DIM VALUES', customDimValues);
  window.dataLayer.push({ event: 'pageViewDimensions', customDimValues });

  yield fork(function* firstVirtualPageView() {
    yield call(virtualPageView);
  });

  yield takeEvery(dep('router', 'types', 'ROUTE_CHANGE_SUCCEED'), virtualPageView);
}
