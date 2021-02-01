import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HeaderTitle } from '../../componenets/Header';
import Navbar from '../../containers/Navbar';
import { Theme } from '../../store/interfaces';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 48%;
  text-align: center;
  min-height: 100%;
`;

const VerificationText = styled.p`
  font-size: 22px;
  padding-bottom: 10px;
`;

const TimeLeft = styled.div`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding-top: 4px;
  padding-right: 1px;
  border: 1px solid ${({ theme }: Theme) => theme.colors.text};
  margin: 0 auto;
`;

const Verification = () => {
  const [timeLeft, setTimeLeft] = useState(5);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const verifyToken = async () => {
      const data = {
        token,
      };

      try {
        await axios.post('/api/accounts/verify-email', data);
      } catch (err) {
        console.log(err);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }

    if (timeLeft === 0) {
      router.push('/');
    }
  }, [timeLeft]);

  return (
    <>
      <HeaderTitle title="Подтверждение Email" desc="Подтверждение Email" />

      <Navbar />

      <Wrapper>
        <VerificationText>
          Адрес электронной почты успешно подтвержден
        </VerificationText>
        <TimeLeft>{timeLeft}</TimeLeft>
      </Wrapper>
    </>
  );
};

export default Verification;
