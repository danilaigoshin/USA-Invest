import Link from 'next/link';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../../componenets/Button';

const Header = styled.h2`
  font-size: 21px;
  font-weight: 500;
  margin-bottom: 15px;
`;

const Desc = styled.div`
  padding: 15px 0;
  font-size: 17px;
  line-height: 24px;

  @media (min-width: 900px) {
    height: 102px;
  }
`;

const ButtonWrapper = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const Image = styled.img`
  margin: 20px 0;
  width: 100%;
`;

interface IProps {
  info: {
    header: string;
    desc: string;
    buttonText: string;
    image: string;
    link: string;
  };
}

const Info: FC<IProps> = ({ info }) => (
  <>
    <Header>{info.header}</Header>
    <Desc>{info.desc}</Desc>
    <ButtonWrapper>
      <Link href={info.link}>
        <a>
          <Button>{info.buttonText}</Button>
        </a>
      </Link>
    </ButtonWrapper>

    <Image src={info.image} />
  </>
);

export { Info };
