import { LineChart } from 'expo-flash-charts';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>expo-flash-charts</Text>
      <LineChart
        style={{ height: 280 }}
        datasets={[
          {
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
          },
          {
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
          },
          {
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
          },
        ]}
      />
    </View>
  );
}
