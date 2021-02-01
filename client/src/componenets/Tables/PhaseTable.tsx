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
    padding: 15px 7px;
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
    padding: 10px 5px;
    font-size: 9px;
  }
`;

const PhaseTable = () => {
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
            <Td>ВВП</Td>
            <Td>Восстановление ВВП</Td>
            <Td>Пик Темпа роста ВВП</Td>
            <Td>Темпы Роста Снижаются</Td>
            <Td>Стагнация или падение ВВП</Td>
          </tr>
          <tr>
            <Td>Рынок труда</Td>
            <Td>Восстановление Рынка Труда</Td>
            <Td>Рынка Труда Продолжает улучшаться</Td>
            <Td>Безработица на минимумах</Td>
            <Td>Рост Безработицы</Td>
          </tr>
          <tr>
            <Td>Промышленность</Td>
            <Td>Восстановление Промышленности</Td>
            <Td>Высокие Темпы Роста Промышленности</Td>
            <Td>Промышленность остывает</Td>
            <Td>Падение Пром. Производства</Td>
          </tr>
          <tr>
            <Td>Кредит</Td>
            <Td>Рост Кредитования</Td>
            <Td>Устойчивый Рост Кредитования</Td>
            <Td>Темпы Роста Снижаются</Td>
            <Td>Стагнация</Td>
          </tr>
          <tr>
            <Td>Корпаративыне прибыли</Td>
            <Td>Доходы начинаю быстро расти</Td>
            <Td>Пик Роста Доходов</Td>
            <Td>Доходы под давлением</Td>
            <Td>Доходы снижаются</Td>
          </tr>
          <tr>
            <Td>Регулирование</Td>
            <Td>Стимулирование продолжается</Td>
            <Td>Нейтральное</Td>
            <Td>Ужесточается</Td>
            <Td>Переход к стимулированию</Td>
          </tr>
          <tr>
            <Td>Запасы</Td>
            <Td>Запасы низкие, продажи улучшаются</Td>
            <Td>Равновесие: Рост Запасов и Продаж</Td>
            <Td>Запасы растут, продажи снижаются</Td>
            <Td>Запасы падают, продажи падают</Td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export { PhaseTable };
