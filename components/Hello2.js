import styled from 'styled-components';

const Button = styled.button`
  color: blue;
`;

export default () =>
  <p>
    Hello World 2 (imported dynamiclly)
    <Button>
      Hola
    </Button>
  </p>;
