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

export function* virtualPageView() {
  const getSetting = dep('settings', 'selectorCreators', 'getSetting');
  const query = yield select(dep('router', 'selectors', 'getQuery'));
  const siteName = yield select(getSetting('generalSite', 'name'));
  const siteUrl = yield select(getSetting('generalSite', 'url'));
  const { url, title } = getUrlAndTitle(query);

  const virtualPage = {
    title: `${siteName} - ${title}`,
    url: `${siteUrl}${url}`,
  };
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
  const extensions = (yield select(dep('build', 'selectors', 'getPackages'))).toString();
  const pageType = /^(pre)?dashboard\./.test(window.location.host) ? 'preview' : 'pwa';
  const plan = 'enterprise';

  const values = { siteId, userIds, theme, extensions, pageType, plan };
  window.dataLayer.push({ event: 'pageViewDimensions', values });

  yield fork(function* firstVirtualPageView() {
    yield call(virtualPageView);
  });

  yield takeEvery(dep('router', 'types', 'ROUTE_CHANGE_SUCCEED'), virtualPageView);
}
