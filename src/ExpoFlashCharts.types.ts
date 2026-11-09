import type { StyleProp, ViewStyle } from 'react-native';

export type OnTapEventPayload = Record<string, never>;

export type ExpoFlashChartsViewProps = {
  onTap: (event: { nativeEvent: OnTapEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
