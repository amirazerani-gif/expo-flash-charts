import {
  LineChart,
  type AnimationConfig,
  type AnimationEasing,
  type LegendConfig,
  type LineDataset,
  type TouchConfig,
  type XAxisConfig,
  type YAxisConfig,
} from 'expo-flash-charts';
import * as React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

// ---------------------------------------------------------------------------
// Datasets
// ---------------------------------------------------------------------------

const SALES: LineDataset = {
  label: 'Sales',
  data: [
    { x: 0, y: 3 },
    { x: 1, y: 7 },
    { x: 2, y: 5 },
    { x: 3, y: 9 },
    { x: 4, y: 6 },
  ],
  color: '#4F46E5',
  mode: 'cubic',
  fill: true,
  lineWidth: 3,
};

const COSTS: LineDataset = {
  label: 'Costs',
  data: [
    { x: 0, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 5 },
  ],
  color: '#F59E0B',
  circles: true,
  fill: true,
};

const STEPPED: LineDataset = {
  label: 'Stepped',
  data: [
    { x: 0, y: 6 },
    { x: 1, y: 4 },
    { x: 2, y: 8 },
    { x: 3, y: 2 },
    { x: 4, y: 7 },
  ],
  mode: 'stepped',
  lineWidth: 3,
  drawValues: true,
};

// Values in the hundreds, so it needs its own scale.
const REVENUE: LineDataset = {
  label: 'Revenue (right axis)',
  data: [
    { x: 0, y: 120 },
    { x: 1, y: 340 },
    { x: 2, y: 210 },
    { x: 3, y: 480 },
    { x: 4, y: 300 },
  ],
  color: '#10B981',
  circles: true,
  axis: 'right',
};

const REVENUE_LEFT: LineDataset = { ...REVENUE, axis: undefined, label: 'Revenue' };

const STEPPED_FORMATTED: LineDataset = {
  ...STEPPED,
  valueFormat: { type: 'number', decimals: 1, suffix: ' k' },
};

const ONE_MIN = 60 * 1000;
const T0 = Date.UTC(2026, 10, 11, 9, 0, 0); // 2026-11-11 09:00 UTC, a real 13-digit timestamp

// One point per minute: closer together than a 32-bit float can resolve at this magnitude.
const CPU: LineDataset = {
  label: 'CPU',
  data: [20, 35, 30, 55, 45, 70, 60].map((y, i) => ({ x: T0 + i * ONE_MIN, y })),
  color: '#4F46E5',
  fill: true,
  mode: 'cubic',
};

// Dataset arrays live at module level so their identity never changes between renders.
// A new array on every render would be re-sent to native (and would replay animations).
const BASE: LineDataset[] = [SALES, COSTS, STEPPED];
const WITH_RIGHT: LineDataset[] = [SALES, REVENUE];
const REVENUE_ONLY: LineDataset[] = [REVENUE_LEFT];
const CPU_ONLY: LineDataset[] = [CPU];
const STEPPED_FORMATTED_ONLY: LineDataset[] = [STEPPED_FORMATTED];
const ANIM_A: LineDataset[] = [SALES, COSTS];
const ANIM_B: LineDataset[] = [STEPPED, COSTS];

// ---------------------------------------------------------------------------
// Axis configs
// ---------------------------------------------------------------------------

const X_TOP: XAxisConfig = { position: 'top', labelCount: 5, granularity: 1, gridLines: false };
const X_OFF: XAxisConfig = { enabled: false };
const Y_OFF: YAxisConfig = { enabled: false };
const Y_RANGE: YAxisConfig = { min: 0, max: 12 };
const Y_RIGHT_OFF: YAxisConfig = { enabled: false };
const Y_FORCED: YAxisConfig = { min: 0, max: 20 };
const Y_STEP_ONE: YAxisConfig = { labelCount: 10, granularity: 1 };

const Y_CURRENCY: YAxisConfig = { format: { type: 'number', prefix: '$', decimals: 0 } };
const Y_PERCENT: YAxisConfig = { format: { type: 'number', suffix: '%', decimals: 1 } };
const X_CATEGORIES: XAxisConfig = {
  format: { type: 'labels', values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  granularity: 1,
  labelCount: 5,
};
const X_TIME: XAxisConfig = {
  timeReference: T0,
  format: { type: 'date', pattern: 'HH:mm' },
  granularity: ONE_MIN,
  labelCount: 4,
};
const X_TIME_NO_REF: XAxisConfig = {
  format: { type: 'date', pattern: 'HH:mm' },
  granularity: ONE_MIN,
  labelCount: 4,
};
const X_BAD_PATTERN: XAxisConfig = { format: { type: 'date', pattern: 'QQ' } };

// ---------------------------------------------------------------------------
// Legend, touch and animation configs
// ---------------------------------------------------------------------------

const LEGEND_OFF: LegendConfig = { enabled: false };
const LEGEND_TOP_CENTER: LegendConfig = { position: 'top', align: 'center' };
const TOUCH_OFF: TouchConfig = {
  highlight: false,
  drag: false,
  pinchZoom: false,
  doubleTapZoom: false,
};
const TOUCH_HIGHLIGHT_ONLY: TouchConfig = { drag: false, pinchZoom: false, doubleTapZoom: false };
const ANIMATE: AnimationConfig = { duration: 1000 };
const ANIM_X: AnimationConfig = { axis: 'x' };
const ANIM_Y: AnimationConfig = { axis: 'y' };
const ANIM_XY: AnimationConfig = { axis: 'xy' };
const ANIM_DEFAULT: AnimationConfig = {};
const ANIM_DURATION_ZERO: AnimationConfig = { duration: 0 };

const EASINGS: AnimationEasing[] = [
  'linear',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'easeInQuart',
  'easeOutQuart',
  'easeInOutQuart',
  'easeInSine',
  'easeOutSine',
  'easeInOutSine',
  'easeInExpo',
  'easeOutExpo',
  'easeInOutExpo',
  'easeInCirc',
  'easeOutCirc',
  'easeInOutCirc',
  'easeInBounce',
  'easeOutBounce',
  'easeInOutBounce',
];
const EASING_CONFIGS: AnimationConfig[] = EASINGS.map((easing) => ({ easing, duration: 1200 }));

const CHART_STYLE = { height: 220 };
const CHART_STYLE_SMALL = { height: 160 };
const LABEL = { fontSize: 12, fontWeight: '600' as const, marginTop: 8, marginBottom: 2 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({
  title,
  expect,
  children,
}: {
  title: string;
  expect: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Expect: {expect}</Text>
      {children}
    </View>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#4F46E5',
      }}>
      <Text style={{ color: '#fff', fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Test bench
// ---------------------------------------------------------------------------

export default function App() {
  const [forced, setForced] = React.useState(true);
  const [currency, setCurrency] = React.useState(true);
  const [legendTop, setLegendTop] = React.useState(true);
  const [swap, setSwap] = React.useState(false);
  const [animLegendOff, setAnimLegendOff] = React.useState(false);
  const [axisSwap, setAxisSwap] = React.useState(false);
  const [defaultsSwap, setDefaultsSwap] = React.useState(false);
  const [easingIndex, setEasingIndex] = React.useState(0);
  const [easingSwap, setEasingSwap] = React.useState(false);
  const [sweeping, setSweeping] = React.useState(false);

  // Next easing: change the curve AND swap the data, because the animation only plays when
  // the data changes. Both updates reach native in the same batch.
  const nextEasing = React.useCallback(() => {
    setEasingIndex((i) => (i + 1) % EASINGS.length);
    setEasingSwap((s) => !s);
  }, []);

  React.useEffect(() => {
    if (!sweeping) return;
    const id = setInterval(nextEasing, 1500);
    return () => clearInterval(id);
  }, [sweeping, nextEasing]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 20 }}>expo-flash-charts</Text>

      {/* ---- Axes ---- */}

      <Section
        title="1. Defaults"
        expect="same as before; x labels are fractional (0.7, 1.4...) because no granularity is set">
        <LineChart style={CHART_STYLE} datasets={BASE} />
      </Section>

      <Section
        title="2. X axis on top, granularity 1, no grid"
        expect="labels 0 to 4 on the top edge, whole numbers only, no vertical grid lines">
        <LineChart style={CHART_STYLE} datasets={BASE} xAxis={X_TOP} />
      </Section>

      <Section
        title="3. Left axis forced to 0 to 12"
        expect="y axis spans 0 to 12 even though the data peaks at 9">
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={Y_RANGE} />
      </Section>

      <Section
        title="4. Dataset on the right axis (auto-enabled)"
        expect="a right axis appears with values in the hundreds, the left axis shows 0 to 10">
        <LineChart style={CHART_STYLE} datasets={WITH_RIGHT} />
      </Section>

      <Section
        title="5. Right axis explicitly disabled"
        expect="no right axis labels, even though Revenue still uses the right scale">
        <LineChart style={CHART_STYLE} datasets={WITH_RIGHT} yAxisRight={Y_RIGHT_OFF} />
      </Section>

      <Section
        title="6. Both axes disabled"
        expect="only the lines and the legend, no axis labels or axis lines">
        <LineChart style={CHART_STYLE} datasets={BASE} xAxis={X_OFF} yAxisLeft={Y_OFF} />
      </Section>

      <Section
        title="6b. Left axis with a step of 1"
        expect="y labels 0, 1, 2, 3 ... 10 instead of 0, 2, 4, 6, 8, 10">
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={Y_STEP_ONE} />
      </Section>

      <Section
        title="7. Prop removal (tap the button)"
        expect="starts at 0 to 20; after the tap the axis goes back to automatic (about 0 to 10); tap again to force it back">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Button
            label={forced ? 'Remove yAxisLeft' : 'Add yAxisLeft'}
            onPress={() => setForced((f) => !f)}
          />
        </View>
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={forced ? Y_FORCED : undefined} />
      </Section>

      {/* ---- Formatters and time axis ---- */}

      <Section
        title="8. Currency labels on the left axis"
        expect="y labels like $0, $100, $200 ... $500, no decimals">
        <LineChart style={CHART_STYLE} datasets={REVENUE_ONLY} yAxisLeft={Y_CURRENCY} />
      </Section>

      <Section title="9. Percent with fixed decimals" expect="y labels like 0.0%, 2.0%, 4.0% ...">
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={Y_PERCENT} />
      </Section>

      <Section
        title="10. Category labels on x"
        expect="Mon, Tue, Wed, Thu, Fri under the five points">
        <LineChart style={CHART_STYLE} datasets={BASE} xAxis={X_CATEGORIES} />
      </Section>

      <Section
        title="11. Time axis with timeReference"
        expect="HH:mm labels about every minute or two (in the device's time zone, so the hour may not be 09), and 7 evenly spaced points">
        <LineChart style={CHART_STYLE} datasets={CPU_ONLY} xAxis={X_TIME} />
      </Section>

      <Section
        title="12. Same data without timeReference"
        expect="the precision problem: points land on a coarse grid, so the line looks stepped and labels repeat or jump unevenly">
        <LineChart style={CHART_STYLE} datasets={CPU_ONLY} xAxis={X_TIME_NO_REF} />
      </Section>

      <Section
        title="13. Formatted value labels on a dataset"
        expect="the stepped line's point labels read like 6.0 k, 4.0 k, 8.0 k">
        <LineChart style={CHART_STYLE} datasets={STEPPED_FORMATTED_ONLY} />
      </Section>

      <Section
        title="14. Invalid date pattern"
        expect="plain numeric x labels (the fallback) and no crash; Logcat shows a warning from ExpoFlashCharts">
        <LineChart style={CHART_STYLE} datasets={BASE} xAxis={X_BAD_PATTERN} />
      </Section>

      <Section
        title="15. Format removal (tap the button)"
        expect="starts with $ labels; after the tap the y labels go back to plain numbers; tap again for $ labels">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Button
            label={currency ? 'Remove format' : 'Add format'}
            onPress={() => setCurrency((c) => !c)}
          />
        </View>
        <LineChart
          style={CHART_STYLE}
          datasets={REVENUE_ONLY}
          yAxisLeft={currency ? Y_CURRENCY : undefined}
        />
      </Section>

      {/* ---- Legend, touch, animation ---- */}

      <Section
        title="16. Legend hidden"
        expect="no legend under the chart; the plot grows to fill the space">
        <LineChart style={CHART_STYLE} datasets={BASE} legend={LEGEND_OFF} />
      </Section>

      <Section
        title="17. Legend on top, centered"
        expect="the legend sits above the plot, centered horizontally">
        <LineChart style={CHART_STYLE} datasets={BASE} legend={LEGEND_TOP_CENTER} />
      </Section>

      <Section
        title="18. All touch off"
        expect="tapping does nothing, and the page scrolls even when your swipe starts on this chart">
        <LineChart style={CHART_STYLE} datasets={BASE} touch={TOUCH_OFF} />
      </Section>

      <Section
        title="19. Highlight only"
        expect="a tap draws crosshair lines on the nearest point; pinching and double-tapping do nothing">
        <LineChart style={CHART_STYLE} datasets={BASE} touch={TOUCH_HIGHLIGHT_ONLY} />
      </Section>

      <Section
        title="20. Animation (1000 ms)"
        expect="the lines rise from the baseline (default axis 'y') on 'Swap data'; 'Toggle legend' must NOT replay the animation">
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <Button label="Swap data" onPress={() => setSwap((s) => !s)} />
          <Button label="Toggle legend" onPress={() => setAnimLegendOff((v) => !v)} />
        </View>
        <LineChart
          style={CHART_STYLE}
          datasets={swap ? ANIM_B : ANIM_A}
          animation={ANIMATE}
          legend={animLegendOff ? LEGEND_OFF : undefined}
        />
      </Section>

      <Section
        title="21. Legend removal (tap the button)"
        expect="starts top-centered; after the tap it returns to the default bottom-left; tap again for top-centered">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Button
            label={legendTop ? 'Remove legend prop' : 'Add legend prop'}
            onPress={() => setLegendTop((v) => !v)}
          />
        </View>
        <LineChart
          style={CHART_STYLE}
          datasets={BASE}
          legend={legendTop ? LEGEND_TOP_CENTER : undefined}
        />
      </Section>

      {/* ---- Animation: axis, defaults, easing ---- */}

      <Section
        title="22. Animation axes: x, y, xy"
        expect="tap Replay: 'x' reveals the line segment by segment (the chunky one), 'y' rises smoothly from the baseline, 'xy' does both; compare how smooth each looks">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Button label="Replay" onPress={() => setAxisSwap((s) => !s)} />
        </View>
        <Text style={LABEL}>{"axis: 'x'"}</Text>
        <LineChart
          style={CHART_STYLE_SMALL}
          datasets={axisSwap ? ANIM_B : ANIM_A}
          animation={ANIM_X}
        />
        <Text style={LABEL}>{"axis: 'y'"}</Text>
        <LineChart
          style={CHART_STYLE_SMALL}
          datasets={axisSwap ? ANIM_B : ANIM_A}
          animation={ANIM_Y}
        />
        <Text style={LABEL}>{"axis: 'xy'"}</Text>
        <LineChart
          style={CHART_STYLE_SMALL}
          datasets={axisSwap ? ANIM_B : ANIM_A}
          animation={ANIM_XY}
        />
      </Section>

      <Section
        title="23. Animation defaults"
        expect="tap Replay: the first chart animates (800 ms, y axis, easeOutCubic); the other two change instantly">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Button label="Replay" onPress={() => setDefaultsSwap((s) => !s)} />
        </View>
        <Text style={LABEL}>{'animation={{}}  (default animation)'}</Text>
        <LineChart
          style={CHART_STYLE_SMALL}
          datasets={defaultsSwap ? ANIM_B : ANIM_A}
          animation={ANIM_DEFAULT}
        />
        <Text style={LABEL}>{'animation={{ duration: 0 }}  (explicitly off)'}</Text>
        <LineChart
          style={CHART_STYLE_SMALL}
          datasets={defaultsSwap ? ANIM_B : ANIM_A}
          animation={ANIM_DURATION_ZERO}
        />
        <Text style={LABEL}>no animation prop</Text>
        <LineChart style={CHART_STYLE_SMALL} datasets={defaultsSwap ? ANIM_B : ANIM_A} />
      </Section>

      <Section
        title="24. Easing sweep (all 22)"
        expect="every easing name is accepted without an error; the label shows the active one; the curves differ (easeInExpo starts very slowly, the bounce ones bounce at the end)">
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <Button label="Next easing" onPress={nextEasing} />
          <Button
            label={sweeping ? 'Stop sweep' : 'Run sweep'}
            onPress={() => setSweeping((s) => !s)}
          />
        </View>
        <Text style={LABEL}>{`${easingIndex + 1}/${EASINGS.length}: ${EASINGS[easingIndex]}`}</Text>
        <LineChart
          style={CHART_STYLE}
          datasets={easingSwap ? ANIM_B : ANIM_A}
          animation={EASING_CONFIGS[easingIndex]}
        />
      </Section>
    </ScrollView>
  );
}
