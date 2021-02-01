import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Theme } from '../../../store/interfaces';
import { chartDark } from '../../../themes';

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
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: {
      text: '',
    },
  },
  title: {
    text: '',
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: 'Наличные',
      data: [8, 11, 15, 18],
    },
    {
      name: 'Долг',
      data: [1, 2, 3, 4],
    },
  ],
};

interface IProps {
  currentPeriod: {
    name: string;
  };

  financials: {
    quarterlyData: {
      Quarterly: [number];
      CashData: [number];
      DebtData: [number];
    };

    yearData: {
      startYear: number;
      CashData: [number];
      DebtData: [number];
    };
  };
}

const ChartCashToDebt: FC<IProps> = ({ currentPeriod, financials }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    if (currentPeriod.name === 'Годовой') {
      const xAxis = {
        categories: [
          financials.yearData.startYear,
          financials.yearData.startYear + 1,
          financials.yearData.startYear + 2,
          financials.yearData.startYear + 3,
        ],
      };

      const series = [
        {
          name: 'Наличные',
          data: financials.yearData.CashData,
        },
        {
          name: 'Долг',
          data: financials.yearData.DebtData,
        },
      ];

      if (currentTheme === 'dark') {
        //@ts-ignore
        setOptions({ ...options, series, ...chartDark, xAxis });
      } else {
        //@ts-ignore
        setOptions({ ...options, series, xAxis });
      }
    }

    if (currentPeriod.name === 'Квартальный') {
      const xAxis = {
        categories: financials.quarterlyData.Quarterly,
      };

      const series = [
        {
          name: 'Наличные',
          data: financials.quarterlyData.CashData,
        },
        {
          name: 'Долг',
          data: financials.quarterlyData.DebtData,
        },
      ];

      if (currentTheme === 'dark') {
        //@ts-ignore
        setOptions({ ...options, series, ...chartDark, xAxis });
      } else {
        //@ts-ignore
        setOptions({ ...options, series, xAxis });
      }
    }
  }, [currentTheme, currentPeriod]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: 'chartContainer' }}
    />
  );
};

export { ChartCashToDebt };
