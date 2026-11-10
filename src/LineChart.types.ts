import type { StyleProp, ViewStyle } from 'react-native';

export type LinePoint = { x: number; y: number };

export type LineDataset = {
  label?: string;
  data: LinePoint[];
  /** Any CSS color string. Converted to a number before it reaches native. */
  color?: string;
  lineWidth?: number;
  mode?: 'linear' | 'cubic' | 'stepped';
  fill?: boolean;
  circles?: boolean;
  drawValues?: boolean;
  /** Which y-axis this dataset uses. Default: 'left'. */
  axis?: 'left' | 'right';
};

export type XAxisConfig = {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  min?: number;
  max?: number;
  labelCount?: number;
  gridLines?: boolean;
};

export type YAxisConfig = {
  enabled?: boolean;
  min?: number;
  max?: number;
  labelCount?: number;
  gridLines?: boolean;
};

export type LegendConfig = {
  enabled?: boolean;
  position?: 'top' | 'bottom';
};

export type TouchConfig = {
  highlight?: boolean;
  drag?: boolean;
  pinchZoom?: boolean;
  doubleTapZoom?: boolean;
};

export type AnimationConfig = {
  /** Milliseconds. 0 disables animation. */
  duration?: number;
};

export type StreamingConfig = {
  /** Oldest points are dropped past this count. */
  maxPoints?: number;
  /** Scroll the viewport to the newest point as data arrives. */
  followLatest?: boolean;
  /** Width of the visible x window while following. */
  visibleXRange?: number;
  /** Upper bound on redraws per second. */
  maxFps?: number;
};

export type ValueSelectedEvent = {
  datasetIndex: number;
  x: number;
  y: number;
};

export type LineChartProps = {
  datasets: LineDataset[];
  xAxis?: XAxisConfig;
  yAxisLeft?: YAxisConfig;
  yAxisRight?: YAxisConfig;
  legend?: LegendConfig;
  touch?: TouchConfig;
  animation?: AnimationConfig;
  streaming?: StreamingConfig;
  onValueSelected?: (event: ValueSelectedEvent) => void;
  onNothingSelected?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type LineChartRef = {
  /** Add points to one dataset. Used for streaming. */
  append(datasetIndex: number, points: LinePoint[]): void;
  /** Replace all datasets. */
  setData(datasets: LineDataset[]): void;
  clear(): void;
  moveToX(x: number): void;
  setVisibleXRange(range: number): void;
};
