import styled from 'styled-components';

export const Grid = styled.div`
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  box-sizing: border-box;
  display: grid;

  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
`;
