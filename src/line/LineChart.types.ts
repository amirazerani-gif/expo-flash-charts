import type { StyleProp, ViewStyle } from 'react-native';

export type LinePoint = { x: number; y: number };

export type NumberFormat = {
  type: 'number';
  /** Fixed number of decimal places. Omit to show up to 2, with trailing zeros trimmed (3, 2.5, 0.07). */
  decimals?: number;
  /** Text placed before the number, e.g. '$'. */
  prefix?: string;
  /** Text placed after the number, e.g. '%'. */
  suffix?: string;
};

export type DateFormat = {
  type: 'date';
  /**
   * Treats the value as milliseconds since the Unix epoch and formats it in the device's time zone.
   * Supported pattern letters: yyyy, MM, dd, HH, mm, ss. Other characters are literal, e.g. 'HH:mm:ss'.
   */
  pattern: string;
};

export type LabelsFormat = {
  type: 'labels';
  /** Category names. A value of 0 shows values[0], 1 shows values[1], and so on. Values outside the list show nothing. */
  values: string[];
};

export type ValueFormat = NumberFormat | DateFormat | LabelsFormat;

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
  /** How the value labels are formatted when `drawValues` is on. */
  valueFormat?: ValueFormat;
  /**
   * Which y-axis this dataset uses. Default: 'left'. A dataset on 'right'
   * switches the right axis on automatically unless `yAxisRight.enabled` is false.
   */
  axis?: 'left' | 'right';
};

export type XAxisConfig = {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  /** In the same units as your data (real timestamps, not offsets). */
  min?: number;
  /** In the same units as your data (real timestamps, not offsets). */
  max?: number;
  /** A hint, not a guarantee: the native library may pick a nearby count to keep labels readable. */
  labelCount?: number;
  /** Floor on the spacing between labels, not a target step. Raise `labelCount` to get more labels. */
  granularity?: number;
  gridLines?: boolean;
  /** How the axis labels are formatted. Omit for the library's default number labels. */
  format?: ValueFormat;
  /**
   * Subtracted from every x value (data, min, max) before it reaches the chart, then added back when
   * labels are formatted and when events report positions. The native chart stores x as a 32-bit float,
   * which cannot hold a millisecond timestamp precisely. Set it to a timestamp near your data, for
   * example the first point's x. Default: 0 (no offset).
   */
  timeReference?: number;
};

export type YAxisConfig = {
  enabled?: boolean;
  min?: number;
  max?: number;
  /** A hint, not a guarantee: the native library may pick a nearby count to keep labels readable. */
  labelCount?: number;
  /** Floor on the spacing between labels, not a target step. Raise `labelCount` to get more labels. */
  granularity?: number;
  gridLines?: boolean;
  /** How the axis labels are formatted. Omit for the library's default number labels. */
  format?: ValueFormat;
};

export type LegendConfig = {
  /** Default: true. */
  enabled?: boolean;
  /** Default: 'bottom'. */
  position?: 'top' | 'bottom';
  /** Default: 'left'. */
  align?: 'left' | 'center' | 'right';
};

/**
 * Every option defaults to true. Inside a ScrollView, set `drag` and `pinchZoom` to false
 * so the page can scroll when a swipe starts on the chart.
 */
export type TouchConfig = {
  /** Tapping (or dragging across) the chart draws crosshair lines on the nearest point. */
  highlight?: boolean;
  /** One-finger panning when the chart is zoomed in. */
  drag?: boolean;
  /** Pinch to zoom. */
  pinchZoom?: boolean;
  /** Double-tap to zoom in. */
  doubleTapZoom?: boolean;
};

export type AnimationAxis = 'x' | 'y' | 'xy';

export type AnimationEasing =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce';

export type AnimationConfig = {
  /**
   * Milliseconds. Passing `animation` at all turns animation on, so `animation={{}}` gives the
   * default animation. Use 0 to turn it off. Default: 800.
   */
  duration?: number;
  /**
   * Which axis builds up. 'x' reveals the line left to right, 'y' grows it up from the baseline,
   * 'xy' does both. Default: 'y'.
   */
  axis?: AnimationAxis;
  /** The speed curve. Default: 'easeOutCubic'. */
  easing?: AnimationEasing;
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
  /**
   * Chart data. When `streaming` is set, this only seeds the chart once on
   * mount; use `ref.setData` to replace data afterwards.
   */
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

// LineChartRef: each method now returns a Promise
export type LineChartRef = {
  append(datasetIndex: number, points: LinePoint[]): Promise<void>;
  setData(datasets: LineDataset[]): Promise<void>;
  clear(): Promise<void>;
  moveToX(x: number): Promise<void>;
  setVisibleXRange(range: number): Promise<void>;
};
