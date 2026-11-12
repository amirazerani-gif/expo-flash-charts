import { requireNativeView } from 'expo';
import * as React from 'react';
import { processColor, type StyleProp, type ViewStyle } from 'react-native';

import type {
  AnimationConfig,
  LegendConfig,
  LineChartProps,
  LineDataset,
  TouchConfig,
  XAxisConfig,
  YAxisConfig,
} from './LineChart.types';

type NativeLineDataset = Omit<LineDataset, 'color'> & { color?: number };

type NativeLineChartProps = {
  datasets: NativeLineDataset[];
  xAxis?: XAxisConfig;
  yAxisLeft?: YAxisConfig;
  yAxisRight?: YAxisConfig;
  legend?: LegendConfig;
  touch?: TouchConfig;
  animation?: AnimationConfig;
  style?: StyleProp<ViewStyle>;
};

const NativeLineChart = requireNativeView<NativeLineChartProps>(
  'ExpoFlashCharts',
  'FlashLineChartView'
);

function toNativeColor(color?: string): number | undefined {
  if (color == null) return undefined;
  const processed = processColor(color);
  return typeof processed === 'number' ? processed : undefined;
}

export default function LineChart({
  datasets,
  xAxis,
  yAxisLeft,
  yAxisRight,
  legend,
  touch,
  animation,
  style,
}: LineChartProps) {
  const nativeDatasets = React.useMemo<NativeLineDataset[]>(
    () => datasets.map(({ color, ...rest }) => ({ ...rest, color: toNativeColor(color) })),
    [datasets]
  );

  return (
    <NativeLineChart
      datasets={nativeDatasets}
      xAxis={xAxis}
      yAxisLeft={yAxisLeft}
      yAxisRight={yAxisRight}
      legend={legend}
      touch={touch}
      animation={animation}
      style={style}
    />
  );
}
