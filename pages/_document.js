/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react';
import Document, { Head, Main, NextScript } from '@worona/next/document'
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps (...args) {
    const documentProps = await super.getInitialProps(...args);
    return { ...documentProps }
  }

  render () {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();
    return (
      <html>
        <Head>
          <title>Worona</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {styleTags}
        </Head>
        <body>
          <div className='root'>
            {main}
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
