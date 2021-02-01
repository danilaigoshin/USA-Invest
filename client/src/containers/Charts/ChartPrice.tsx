import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Theme } from '../../store/interfaces';
import { chartDark } from '../../themes';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
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
    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: 'month',
          text: '1M',
        },
        {
          count: 3,
          type: 'month',
          text: '3M',
        },
        {
          count: 6,
          type: 'month',
          text: '6M',
        },
        {
          type: 'ytd',
          text: 'YTD',
        },
        {
          count: 12,
          type: 'month',
          text: '1г',
        },
        {
          type: 'all',
          text: 'Все',
        },
      ],
      inputEnabled: false,
    },
    chart: {
      height: 300,
    },
    plotOptions: {
      series: {
        dataGrouping: {
          dateTimeLabelFormats: {
            week: ['Неделя с %Aа, %b %e, %Y'],
          },
        },
      },
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
    },
  });
}

const stockOptions = {
  rangeSelector: {
    selected: 5,
  },
  title: {
    text: 'Цена акции',
  },
  navigator: {
    enabled: false,
  },
};

interface IProps {
  price: [[number, number]];
}

const ChartPrice: FC<IProps> = ({ price }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    const newData = price.map((item) => {
      return [item[0], item[1]];
    });

    const series = {
      data: newData,
    };

    const tooltip = {
      pointFormat: `{point.y:.2f} $`,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0',
      },
    };

    if (currentTheme === 'dark') {
      //@ts-ignore
      setOptions({ ...options, series, ...chartDark, tooltip });
    } else {
      //@ts-ignore
      setOptions({ ...options, series, tooltip });
    }
  }, [currentTheme, price]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
      containerProps={{ className: 'chartContainer' }}
    />
  );
};

export { ChartPrice };
