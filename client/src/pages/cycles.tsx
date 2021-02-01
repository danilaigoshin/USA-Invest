import styled from 'styled-components';
import Navbar from '../containers/Navbar';
import { IndustryTable, PhaseTable } from '../componenets/Tables';
import { Theme } from '../store/interfaces';
import Footer from '../containers/Footer';
import { HeaderTitle } from '../componenets/Header';

const Wrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  padding: 60px 0;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const Padding = styled.div`
  padding-top: 80px;
`;

const PaddingLink = styled.div`
  padding-top: 40px;
  text-align: right;
`;

const Link = styled.a`
  padding-left: 10px;
  color: ${({ theme }: Theme) => theme.colors.text};
  cursor: pointer;
`;

const Cycles = () => {
  return (
    <>
      <HeaderTitle
        title="Экономичесие циклы - USA Invest"
        desc="На нашем сайте вы можете проанализировать в какой фазе находится рынок и узнать какие сектора экономики проявляют лучше динамику."
      />

      <Navbar />

      <Wrapper>
        <PhaseTable />

        <Padding>
          <IndustryTable />
        </Padding>

        <PaddingLink>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://t.me/goodtraders"
          >
            Взято с телеграмм канала Дмитрия Солодина
          </Link>
        </PaddingLink>
      </Wrapper>

      <Footer />
    </>
  );
};

export default Cycles;
