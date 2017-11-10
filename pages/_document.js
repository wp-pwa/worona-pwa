/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react';
import Document, { Head, Main } from '@worona/next/document';
import { ServerStyleSheet } from 'styled-components';
import { DOMProperty } from 'react-dom/lib/ReactInjection';
import { properties as DOMProperties } from 'react-dom/lib/DOMProperty';

if (typeof DOMProperties.amp === 'undefined') {
  DOMProperty.injectDOMPropertyConfig({
    Properties: { amp: DOMProperty.MUST_USE_ATTRIBUTE },
    isCustomAttribute: attributeName => attributeName.startsWith('amp-'),
  });
}

if (typeof DOMProperties.on === 'undefined') {
  DOMProperty.injectDOMPropertyConfig({
    Properties: { on: DOMProperty.MUST_USE_ATTRIBUTE },
    isCustomAttribute: attributeName => attributeName === 'on',
  });
}

export default class MyDocument extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    return { ...documentProps };
  }

  render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();

    return (
      <html amp="">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta name="HandheldFriendly" content="true" />
          <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
          <noscript>
            <style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style>
          </noscript>
          <script async src="https://cdn.ampproject.org/v0.js" />
          <script
            async
            custom-element="amp-sidebar"
            src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
          />
          <script
            async
            custom-element="amp-social-share"
            src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"
          />
          {styleTags}
        </Head>
        <body>
          <div className="root">{main}</div>
        </body>
      </html>
    );
  }
}
