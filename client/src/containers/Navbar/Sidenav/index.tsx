import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../../themes/device';
import { Burger } from './Burger';
import { Menu } from './Menu';

const MobileVisible = styled.div`
  display: none;

  @media ${device.tablet}, ${device.mobile} {
    display: block;
  }
`;

interface IProps {
  Links: {
    name: string;
    icon: string;
    href: string;
  }[];
}

const SideNav: FC<IProps> = ({ Links }) => {
  const [open, setOpen] = useState(false);

  const menuHandler = () => {
    setOpen(!open);
  };

  return (
    <MobileVisible>
      <Burger open={open} menuHandler={menuHandler} />
      <Menu Links={Links} open={open} menuHandler={menuHandler} />
    </MobileVisible>
  );
};

export default SideNav;
