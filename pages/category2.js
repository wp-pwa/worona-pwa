import dynamic from '@worona/next/dynamic';
import Link from '@worona/next/link';

const DynamicHello = dynamic(import('../components/Hello2'));

export default () =>
  <div>
    <DynamicHello />
    <Link prefetch href="/category"><a>1</a></Link>
  </div>;
