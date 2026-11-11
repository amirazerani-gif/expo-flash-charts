import { LineChart, type LineDataset, type XAxisConfig, type YAxisConfig } from 'expo-flash-charts';
import * as React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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

const BASE = [SALES, COSTS, STEPPED];
const WITH_RIGHT = [SALES, REVENUE];

const X_TOP: XAxisConfig = { position: 'top', labelCount: 5, granularity: 1, gridLines: false };
const X_OFF: XAxisConfig = { enabled: false };
const Y_OFF: YAxisConfig = { enabled: false };
const Y_RANGE: YAxisConfig = { min: 0, max: 12 };
const Y_RIGHT_OFF: YAxisConfig = { enabled: false };
const Y_FORCED: YAxisConfig = { min: 0, max: 20 };
const Y_STEP_ONE: YAxisConfig = { labelCount: 10, granularity: 1 };

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

const REVENUE_LEFT: LineDataset = { ...REVENUE, axis: undefined, label: 'Revenue' };
const STEPPED_FORMATTED: LineDataset = {
  ...STEPPED,
  valueFormat: { type: 'number', decimals: 1, suffix: ' k' },
};

const Y_CURRENCY: YAxisConfig = { format: { type: 'number', prefix: '€', decimals: 0 } };
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

const CHART_STYLE = { height: 220 };

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

export default function App() {
  const [forced, setForced] = React.useState(true);
  const [currency, setCurrency] = React.useState(true);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 20 }}>expo-flash-charts</Text>

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
        title="2. y axis on left, granularity 1, no grid"
        expect="labels 0 to 4 on the top edge, whole numbers only, no vertical grid lines">
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={Y_STEP_ONE} />
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
        title="7. Prop removal (tap the button)"
        expect="starts at 0 to 20; after the tap the axis goes back to automatic (about 0 to 10); tap again to force it back">
        <Pressable
          onPress={() => setForced((f) => !f)}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: '#4F46E5',
            marginBottom: 8,
          }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {forced ? 'Remove yAxisLeft' : 'Add yAxisLeft'}
          </Text>
        </Pressable>
        <LineChart style={CHART_STYLE} datasets={BASE} yAxisLeft={forced ? Y_FORCED : undefined} />
      </Section>

      <Section
        title="8. Currency labels on the left axis"
        expect="y labels like $0, $100, $200 ... $500, no decimals">
        <LineChart style={CHART_STYLE} datasets={[REVENUE_LEFT]} yAxisLeft={Y_CURRENCY} />
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
        <LineChart style={CHART_STYLE} datasets={[CPU]} xAxis={X_TIME} />
      </Section>

      <Section
        title="12. Same data without timeReference"
        expect="the precision problem: points land on a coarse grid, so the line looks stepped and labels repeat or jump unevenly">
        <LineChart style={CHART_STYLE} datasets={[CPU]} xAxis={X_TIME_NO_REF} />
      </Section>

      <Section
        title="13. Formatted value labels on a dataset"
        expect="the stepped line's point labels read like 6.0 k, 4.0 k, 8.0 k">
        <LineChart style={CHART_STYLE} datasets={[STEPPED_FORMATTED]} />
      </Section>

      <Section
        title="14. Invalid date pattern"
        expect="plain numeric x labels (the fallback) and no crash; Logcat shows a warning from ExpoFlashCharts">
        <LineChart style={CHART_STYLE} datasets={BASE} xAxis={X_BAD_PATTERN} />
      </Section>

      <Section
        title="15. Format removal (tap the button)"
        expect="starts with $ labels; after the tap the y labels go back to plain numbers; tap again for $ labels">
        <Pressable
          onPress={() => setCurrency((c) => !c)}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: '#4F46E5',
            marginBottom: 8,
          }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {currency ? 'Remove format' : 'Add format'}
          </Text>
        </Pressable>
        <LineChart
          style={CHART_STYLE}
          datasets={[REVENUE_LEFT]}
          yAxisLeft={currency ? Y_CURRENCY : undefined}
        />
      </Section>
    </ScrollView>
  );
}
