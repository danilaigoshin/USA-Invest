import { darken, lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { device } from '../../themes/device';

const TableHeader = styled.div`
  background-color: ${({ theme }: Theme) => theme.colors.secondary};
  border-radius: 10px;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;

  @media ${device.mobile} {
    padding: 12px;
    font-size: 10px;
  }
`;

const Td = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: 300;
  font-size: 12px;
  border-bottom: solid 1px
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.75', theme.colors.text)};
  word-wrap: break-word;

  @media ${device.mobile} {
    &:first-child {
      font-size: 9px;
    }
    padding: 10px 5px;
    font-size: 10px;
  }
`;

const BetterColor = styled.div`
  color: #6d9e6d;
`;

const MuchBetterColor = styled.div`
  color: #3d993d;
`;

const WorseColor = styled.div`
  color: #b64e4e;
`;

const MuchWorseColor = styled.div`
  color: #b60000;
`;

const IndustryTable = () => {
  return (
    <>
      <TableHeader>
        <Table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <Th></Th>
              <Th>Фаза расцвета</Th>
              <Th>Фаза развития</Th>
              <Th>Фаза заката</Th>
              <Th>Фаза рецессии</Th>
            </tr>
          </thead>
        </Table>
      </TableHeader>

      <Table cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <Td>Финансы</Td>
            <Td>
              <BetterColor>Лучше рынка</BetterColor>
            </Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>Недвижимость</Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
          </tr>
          <tr>
            <Td>Циклические</Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td>
              <WorseColor>Хуже Рынка</WorseColor>
            </Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>Защитные</Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
          </tr>
          <tr>
            <Td>Технологические</Td>
            <Td>
              <BetterColor>Лучше рынка</BetterColor>
            </Td>
            <Td>
              <BetterColor>Лучше рынка</BetterColor>
            </Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
          </tr>
          <tr>
            <Td>Промышленность</Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
          </tr>
          <tr>
            <Td>Основные материалы</Td>
            <Td>
              <BetterColor>Лучше рынка</BetterColor>
            </Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>Здравоохранение</Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
            <Td></Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
          </tr>
          <tr>
            <Td>Энергия</Td>
            <Td>
              <MuchWorseColor>Ощутимо Хуже Рынка</MuchWorseColor>
            </Td>
            <Td></Td>
            <Td>
              <MuchBetterColor>Ощутимо Лучше Рынка</MuchBetterColor>
            </Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>Сервисы</Td>
            <Td></Td>
            <Td>
              <BetterColor>Лучше рынка</BetterColor>
            </Td>
            <Td></Td>
            <Td>
              <WorseColor>Хуже Рынка</WorseColor>
            </Td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export { IndustryTable };
