import React from 'react';
import styled from 'styled-components';
import { device } from '../themes/device';

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

const H3 = styled.h3`
  font-size: 28px;
  line-height: 32px;
  font-weight: 700;
  padding-top: 30px;
`;

const P = styled.p`
  font-size: 18px;
  padding-top: 30px;

  @media ${device.mobile} {
    font-size: 16px;
  }
`;

const Contacts = () => {
  return (
    <>
      <Wrapper>
        <H3>Контакты</H3>

        <P>Email: igoshin6@mail.ru</P>

        <P>Группа Вконтакте: https://vk.com/usainvest</P>

        <H3>Реквизиты</H3>

        <P>ИП Игошин Павел Евгеньевич</P>

        <P>ИНН 583600145266</P>

        <P>ОГРНИП 318583500021097</P>
      </Wrapper>
    </>
  );
};

export default Contacts;
