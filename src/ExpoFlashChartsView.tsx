import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoFlashChartsViewProps } from './ExpoFlashCharts.types';

const NativeView: React.ComponentType<ExpoFlashChartsViewProps> = requireNativeView('ExpoFlashCharts');

export default function ExpoFlashChartsView(props: ExpoFlashChartsViewProps) {
  return <NativeView {...props} />;
}
