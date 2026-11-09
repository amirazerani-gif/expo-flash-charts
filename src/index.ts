// Reexport the native module. On web, it will be resolved to ExpoFlashChartsModule.web.ts
// and on native platforms to ExpoFlashChartsModule.ts
export { default } from './ExpoFlashChartsModule';
export { default as ExpoFlashChartsView } from './ExpoFlashChartsView';
export * from './ExpoFlashCharts.types';
