import { darken, lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';

const SocialWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 30px;
`;

const BorderBottom = styled.div`
  border-bottom: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.7', theme.colors.text)
        : lighten('0.7', theme.colors.text)};

  padding: 15px 0;
`;

const SocialIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const GoogleIcon = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const SocialSignIn = () => {
  return (
    <>
      <BorderBottom />

      <SocialWrapper>
        <a href="/api/accounts/externalLogin/Facebook">
          <SocialIcon src="/Icons/Social/fb.svg" />
        </a>

        <a href="/api/accounts/externalLogin/Vkontakte">
          <SocialIcon src="/Icons/Social/vk.svg" />
        </a>

        <a href="/api/accounts/externalLogin/Google">
          <GoogleIcon src="/Icons/Social/google.png" />
        </a>
      </SocialWrapper>
    </>
  );
};

export { SocialSignIn };
