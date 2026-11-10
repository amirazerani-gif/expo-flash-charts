import * as React from 'react';
import { View } from 'react-native';

import type { LineChartProps } from './LineChart.types';

let warned = false;

export default function LineChart({ style }: LineChartProps) {
  if (__DEV__ && !warned) {
    warned = true;
    console.warn('expo-flash-charts: charts are not supported on web.');
  }
  return <View style={style} />;
}
