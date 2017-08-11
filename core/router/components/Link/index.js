import React from 'react';
import NextLink from '@worona/next/link';
import { connect } from 'react-redux';
import { getSiteId } from '../../../settings/selectors';

const Link = ({ query, as, children, siteId }) =>
  <NextLink href={{ pathname: '/', query: { ...query, siteId } }} as={as || '/'}>
    {children}
  </NextLink>

const mapStateToProps = state => ({
  siteId: getSiteId(state),
});

export default connect(mapStateToProps)(Link);
