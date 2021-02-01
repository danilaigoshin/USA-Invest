import Link from 'next/link';
import styled from 'styled-components';
import { Theme } from '../store/interfaces';

const Layout = styled.div`
  position: relative;
  height: 100vh;
`;

const NotFound = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 767px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
  padding: 15px;
`;

const NotFound404 = styled.div`
  position: relative;
  height: 220px;
`;

const H1 = styled.h1`
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 186px;
  font-weight: 200;
  margin: 0;
  background: linear-gradient(
    130deg,
    ${({ theme }: Theme) => theme.colors.text},
    ${({ theme }: Theme) => theme.colors.secondary}
  );

  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  text-transform: uppercase;
`;

const H2 = styled.div`
  font-weight: 200;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 33px;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 36px;
`;

const Image = styled.img`
  height: 27px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const P = styled.p`
  font-size: 16px;
  font-weight: 200;
  margin-top: 0;
  margin-bottom: 10px;
`;

const MainPageLink = styled.a`
  color: #0673d8;
  font-weight: 200;
  text-decoration: none;
  border-bottom: 1px dashed #0673d8;
  border-radius: 2px;
  cursor: pointer;
`;

const ErrorPage = () => (
  <Layout>
    <NotFound>
      <NotFound404>
        <H1>404</H1>
      </NotFound404>
      <H2>
        <Image src="/logo.svg" alt="бык" />
        <span style={{ marginLeft: 20 }}>СТРАНИЦА НЕ НАЙДЕНА</span>
      </H2>
      <P>К сожалению или к счастью этой страницы не существует.</P>

      <Link href="/" passHref>
        <MainPageLink>Вернуться на главную.</MainPageLink>
      </Link>
    </NotFound>
  </Layout>
);

export default ErrorPage;
