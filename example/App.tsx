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
    </ScrollView>
  );
}
