const Themes = {
  SomeTheme: 'some-theme',
  OtherTheme: 'other-theme',
};

const ThemesComponents = Object.entries(Themes).reduce(
  (obj, [key, value]) => ({ ...obj, [key]: require(`../packages/${value}/components`) }),
  {}
);

const CurrentTheme = 'SomeTheme';
const CurrentHome = ThemesComponents[CurrentTheme].Home;

export default () =>
  <div>
    <CurrentHome />
  </div>;
