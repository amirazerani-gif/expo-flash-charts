import { registerWebModule, NativeModule } from 'expo';

// ExpoFlashChartsModule is not available on the web platform.
class ExpoFlashChartsModule extends NativeModule<{}> {}

export default registerWebModule(ExpoFlashChartsModule, 'ExpoFlashChartsModule');
