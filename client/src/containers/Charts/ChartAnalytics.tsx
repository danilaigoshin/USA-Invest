import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Theme } from '../../store/interfaces';
import { chartDark } from '../../themes';

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    lang: {
      loading: 'Загрузка...',
      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      weekdays: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
      ],
      shortMonths: [
        'Янв',
        'Фев',
        'Март',
        'Апр',
        'Май',
        'Июнь',
        'Июль',
        'Авг',
        'Сент',
        'Окт',
        'Нояб',
        'Дек',
      ],
      rangeSelectorFrom: 'С',
      rangeSelectorTo: 'По',
      rangeSelectorZoom: 'Период',
      downloadPNG: 'Скачать PNG',
      downloadJPEG: 'Скачать JPEG',
      downloadPDF: 'Скачать PDF',
      downloadSVG: 'Скачать SVG',
      printChart: 'Напечатать график',
    },
  });
}

const stockOptions = {
  chart: {
    type: 'column',
  },
  title: {
    text: 'Рекомендации Аналитиков',
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Аналитики',
    },
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: 'bold',
      },
    },
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Всего: {point.stackTotal}',
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
      },
    },
  },
};

interface IProps {
  data: {
    buy: number;
    hold: number;
    period: string;
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
  }[];
}

const ChartAnalytics: FC<IProps> = ({ data }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    const dataLength = 4;

    const periods = [];
    const strongBuy = [];
    const buy = [];
    const hold = [];
    const sell = [];
    const strongSell = [];

    for (let i = 0; i < dataLength; i++) {
      periods.push(data[i].period);
      strongBuy.push(data[i].strongBuy);
      buy.push(data[i].buy);
      hold.push(data[i].hold);
      sell.push(data[i].sell);
      strongSell.push(data[i].strongSell);
    }

    const xAxis = {
      categories: periods.reverse(),
    };

    const series = [
      {
        name: 'Строго покупать',
        data: strongBuy.reverse(),
      },
      {
        name: 'Покупать',
        data: buy.reverse(),
      },
      {
        name: 'Держать',
        data: hold.reverse(),
      },
      {
        name: 'Продавать',
        data: sell.reverse(),
      },
      {
        name: 'Строго продавать',
        data: strongSell.reverse(),
      },
    ];

    if (currentTheme === 'dark') {
      //@ts-ignore
      setOptions({ ...options, series, ...chartDark, xAxis });
    } else {
      //@ts-ignore
      setOptions({ ...options, series, xAxis });
    }
  }, [currentTheme, data]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: 'chartContainer' }}
    />
  );
};

export { ChartAnalytics };
