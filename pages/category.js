import dynamic from '@worona/next/dynamic';
import Link from '@worona/next/link';

const DynamicHello = dynamic(import('../components/Hello1'));

const category = () =>
  <div>
    <DynamicHello />
    <Link prefetch href="/category2"><a>2</a></Link>
  </div>;

category.getInitialProps = async () => {
  import('../components/Hello2');
  return {};
}

export default category;
