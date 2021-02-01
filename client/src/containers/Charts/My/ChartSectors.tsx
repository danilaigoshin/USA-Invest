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
    text: 'По секторам',
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

interface IPortfolio {
  amount: number;
  company: string;
  isDividend: false;
  price: number;
  sector: string;
  ticker: string;
}

interface IProps {
  portfolio: IPortfolio[];
}

const ChartSectors: FC<IProps> = ({ portfolio }) => {
  const [options, setOptions] = useState(stockOptions);

  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  useEffect(() => {
    const res = portfolio.map((stock) => {
      const currentStockAmount = stock.price * stock.amount;
      return { name: stock.sector, y: currentStockAmount };
    });

    const data = Array.from(
      res.reduce(
        (m, { name, y }) => m.set(name, (m.get(name) || 0) + y),
        new Map()
      ),
      ([name, y]) => ({ name, y })
    );

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

export { ChartSectors };
