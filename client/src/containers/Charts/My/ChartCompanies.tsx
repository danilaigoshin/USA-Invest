import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Theme } from '../../../store/interfaces';
import { chartDark } from '../../../themes';

const stockOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  title: {
    text: 'По акциям',
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  },
  accessibility: {
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
    },
  },
};

interface IProps {
  portfolio: {
    amount: number;
    company: string;
    isDividend: false;
    price: number;
    sector: string;
    ticker: string;
  }[];
}

const ChartCompanies: FC<IProps> = ({ portfolio }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    const data = portfolio.map((stock) => {
      const currentStockAmount = stock.price * stock.amount;
      return { name: stock.company, y: currentStockAmount };
    });

    const series = [
      {
        name: 'Доля',
        colorByPoint: true,
        data,
      },
    ];

    if (currentTheme === 'dark') {
      //@ts-ignore
      setOptions({ ...options, series, ...chartDark });
    } else {
      //@ts-ignore
      setOptions({ ...options, series });
    }
  }, [currentTheme, portfolio]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: 'chartContainer' }}
    />
  );
};

export { ChartCompanies };
