/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react';
import Document, { Head, Main, NextScript } from '@worona/next/document';
import { ServerStyleSheet } from 'styled-components';
import gtmParts from 'react-google-tag-manager';

export default class MyDocument extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    return { ...documentProps };
  }

  render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();

    // Google Tag Manager Props
    const id = 'GTM-K3S2BMT';
    const { scriptAsReact, noScriptAsReact } = gtmParts({ id });
    // End Google Tag Manager Props

    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta name="HandheldFriendly" content="true" />
          {styleTags}
          {/* Google Tag Manager */}
          {scriptAsReact()}
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          {noScriptAsReact()}
          <div className="root">{main}</div>
          <NextScript />
        </body>
      </html>
    );
  }
}
