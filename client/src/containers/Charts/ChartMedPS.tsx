import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Theme } from '../../store/interfaces';
import { useSelector } from 'react-redux';
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
  title: {
    text: 'Справедливая стоимость',
  },
  series: [
    {
      data: [],
    },
  ],
  yAxis: {
    title: {
      text: 'Цена',
    },
  },
  tooltip: {
    pointFormat: 'Цена (USD): {point.y:,.1f}',
  },
  xAxis: {
    type: 'datetime',
    labels: {
      format: '{value:%Y}',
    },
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
};

interface IProps {
  price: [[string, number]];
  medps: [[string, number]];
}

const ChartMedPS: FC<IProps> = ({ price, medps }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    const priceNew = price.map((item) => {
      const date = Date.parse(item[0]);
      return [date, item[1]];
    });

    const medpsNew = medps.map((item) => {
      const date = Date.parse(item[0]);
      return [date, item[1]];
    });

    const series = [
      {
        name: 'Цена (USD)',
        data: priceNew,
      },
      {
        name: 'Справедливая стоимость (USD)',
        data: medpsNew,
      },
    ];

    if (currentTheme === 'dark') {
      //@ts-ignore
      setOptions({ ...options, series, ...chartDark });
    } else {
      //@ts-ignore
      setOptions({ ...options, series });
    }
  }, [currentTheme, medps]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: 'chartContainer' }}
    />
  );
};

export { ChartMedPS };
