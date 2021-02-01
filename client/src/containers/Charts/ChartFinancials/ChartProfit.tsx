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
      name: 'Выручка',
      data: [8, 11, 15, 18],
    },
    {
      name: 'Прибыль',
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
      IncomeData: [number];
      RevenueData: [number];
    };

    yearData: {
      startYear: number;
      IncomeData: [number];
      RevenueData: [number];
    };
  };
}

const ChartProfit: FC<IProps> = ({ financials, currentPeriod }) => {
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
          name: 'Выручка',
          data: financials.yearData.RevenueData,
        },
        {
          name: 'Прибыль',
          data: financials.yearData.IncomeData,
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
          name: 'Выручка',
          data: financials.quarterlyData.RevenueData,
        },
        {
          name: 'Прибыль',
          data: financials.quarterlyData.IncomeData,
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

export { ChartProfit };
