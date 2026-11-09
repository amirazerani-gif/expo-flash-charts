import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoFlashChartsModule extends NativeModule<{}> {}

export default requireNativeModule<ExpoFlashChartsModule>('ExpoFlashCharts');
