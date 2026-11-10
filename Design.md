# expo-flash-charts: design notes

Status: draft, 2026-11-10. Native API member names below are written from memory of DGCharts 5.x and MPAndroidChart 3.1.x (the AppDevNext fork). Verify each one when implementing it.

## 1. What and why

Native charts for Expo apps. Instead of drawing charts in JS (SVG/Skia), bridge the mature native chart libraries with the Expo Modules API:

| Platform | Library | Notes |
|---|---|---|
| iOS | DGCharts 5.x (CocoaPods) | Maintained. The iOS port of MPAndroidChart. |
| Android | AppDevNext/AndroidChart 3.1.0.x (JitPack), a maintained fork of MPAndroidChart | Upstream (PhilJay) is abandoned. The fork is in maintenance mode: issues ignored, PRs accepted. Same API and package. Stay on the 3.1.0.x line; newer Kotlin-conversion lines rename the package. |

Goals:
- One clean, typed, cross-platform API per chart.
- Real-time streaming as the headline feature (native buffering, no JS re-render per tick).
- Lightweight, publishable to npm, MIT licensed.

Prior art and the gap:
- `react-native-charts-wrapper`: same idea, old architecture, awkward in Expo.
- `rn-native-ios-charts`: SwiftUI Charts, iOS only, alpha.
- Expo's own docs wrap these two libraries as a tutorial, not a library.
- Gap: maintained, Expo Modules API, new architecture, one API for both platforms.

Platforms: iOS and Android only. Web gets an empty-View fallback (`*.web.tsx`) that logs a dev warning, so consumer web builds don't crash.

## 2. Scope

First five charts, in build order:

1. **LineChart** (built first, alone)
2. **BarChart** (grouped and stacked), plus `HorizontalBarChart` as a variant. Both libraries use a separate native class for it.
3. **PieChart** (donut hole, center text, slice spacing)
4. **ScatterChart**
5. **CandleStickChart**

Later: RadarChart, BubbleChart, CombinedChart (hardest on the TS side, so last).

Rule: one component per chart type, not one `ChartView` with a `type` prop. Strict types per chart, small native views.

## 3. Principles

- **Contract first.** TypeScript types are written before native code. Native sides implement the contract.
- **One chart in isolation first.** Build LineChart end to end. Only when the second chart starts duplicating code, extract the shared layer from real code.
- **Android first, then iOS.** Android can be built and tested on the Windows laptop. iOS needs the Mac.
- **Defaults live on the native side.** Optional TS fields that are missing mean "use the native default".
- **Colors cross the bridge as numbers.** The JS wrapper runs `processColor()`, so Kotlin and Swift only parse integers.
- **No JS callbacks in the draw loop.** Formatters are declarative (see section 7).
- **Parity matrix.** Expose only what both platforms support. Platform-specific options go under an `ios` / `android` escape-hatch prop.

## 4. User API

Props describe the chart, the ref streams data, events report touch. See `src/LineChart.types.ts` for the full contract.

```tsx
const ref = useRef<LineChartRef>(null);

<LineChart
  ref={ref}
  style={{ height: 240 }}
  datasets={[{ label: 'CPU', data: points, color: '#4F46E5', mode: 'cubic', fill: true }]}
  xAxis={{ position: 'bottom', labelCount: 5, gridLines: false }}
  yAxisLeft={{ min: 0, max: 100 }}
  yAxisRight={{ enabled: false }}
  legend={{ enabled: true }}
  touch={{ highlight: true, pinchZoom: true }}
  animation={{ duration: 300 }}
  streaming={{ maxPoints: 500, followLatest: true, visibleXRange: 60, maxFps: 30 }}
  onValueSelected={(e) => console.log(e.datasetIndex, e.x, e.y)}
/>

ref.current?.append(0, [{ x: t, y: value }]);   // dataset index, points
```

Shared by all charts (extracted later, not designed up front): `style`, `animation`, `legend`, `touch`, theme colors, `noDataText`, `onValueSelected`, `onNothingSelected`.
Cartesian only (Line, Bar, Scatter, Candle): `xAxis`, `yAxisLeft`, `yAxisRight`, `onScale`, `onTranslate`.
Per chart: dataset options (Line: `mode`, `circles`, `fill`; Bar: `stacked`, `groupSpace`; Pie: `holeRadius`, `sliceSpace`; Candle: increasing/decreasing colors).

Ref methods (parity on both platforms): `append`, `setData`, `clear`, `moveToX`, `setVisibleXRange`, `zoom`, `fitScreen`, `centerViewTo`, `highlight`, `animate`, `snapshot`.
Events (parity): `onValueSelected`, `onNothingSelected`, `onScale`, `onTranslate`.

## 5. Native architecture (Expo Modules)

How a prop travels: `LineChart.tsx` calls `requireNativeView('ExpoFlashCharts', ...)`, and Expo's native core finds the view because autolinking registered the Module class listed in `expo-module.config.json`.

| Piece | What it is |
|---|---|
| `expo-module.config.json` | Tells autolinking which Module classes to register per platform. |
| Module class (`ExpoFlashChartsModule`) | Its `definition()` declares what the module exposes: views, props, events, functions. |
| `View(...) { ... }` block | Declares a native view and its `Prop`s, `Events` and view functions. |
| View class (`ExpoView` subclass) | The real native view. Holds the DGCharts/MPAndroidChart chart object. |
| `Record` | A typed data class Expo fills from a JS object. Used for datasets and config groups. |
| `AsyncFunction` (inside `View`) | Native method callable from JS through the view ref. The ref API uses these. |
| `Events` / `EventDispatcher` | Native-to-JS events. They arrive wrapped in `nativeEvent`, and our wrapper unwraps them. |
| `build.gradle` / `.podspec` | Pull in the Android chart fork (JitPack repo) and DGCharts. |

Native view names must not clash with library classes. Ours are `FlashLineChartView`, and so on, because DGCharts already has `LineChartView`.

## 6. Dataset mapping (almost 1 to 1)

Both libraries use the same model: entry, then dataset, then chart data, then chart.

| Concept | MPAndroidChart / AppDevNext fork (Kotlin) | DGCharts (Swift) |
|---|---|---|
| Chart view | `LineChart` | `LineChartView` |
| Point | `Entry(x, y)` | `ChartDataEntry(x:y:)` |
| Dataset | `LineDataSet(entries, label)` | `LineChartDataSet(entries:label:)` |
| Chart data | `LineData(sets)` | `LineChartData(dataSets:)` |
| Line mode | `LineDataSet.Mode.LINEAR / CUBIC_BEZIER / STEPPED` | `.linear / .cubicBezier / .stepped` |
| Axes | `xAxis`, `axisLeft`, `axisRight` | `xAxis`, `leftAxis`, `rightAxis` |
| Legend | `chart.legend` | `chart.legend` |
| Touch | `setTouchEnabled`, `setDragEnabled`, `setPinchZoom`, `isDoubleTapToZoomEnabled` | `dragEnabled`, `pinchZoomEnabled`, `doubleTapToZoomEnabled` |
| Selection event | `OnChartValueSelectedListener` | `ChartViewDelegate` (`chartValueSelected`) |
| Animation | `animateX / animateY / animateXY(ms)` | `animate(xAxisDuration:yAxisDuration:)` |
| Visible window | `setVisibleXRangeMaximum / Minimum` | `setVisibleXRangeMaximum / Minimum` |
| Scroll | `moveViewToX(x)` | `moveViewToX(_:)` |
| Append point | `data.addEntry(entry, datasetIndex)` | `data.appendEntry(_:toDataSet:)` |
| Refresh | `data.notifyDataChanged()`, `chart.notifyDataSetChanged()`, `chart.invalidate()` | `data.notifyDataChanged()`, `chart.notifyDataSetChanged()` |
| Snapshot | `chart.chartBitmap` | `chart.getChartImage(transparent:)` |

The mapping layer is a thin translator per chart: parse Records, build sets, apply config. Shared helpers (axis, legend, touch config) get extracted after the second chart.

## 7. Proposed streaming and ref implementation

Proposal, not yet validated. The stress screen in the example app decides.

- **Uncontrolled mode.** Props describe the chart. The ref pushes new data. Never re-send whole arrays through props per tick.
- **Ref methods are view-scoped `AsyncFunction`s** declared in the `View` block. The JS wrapper uses `useImperativeHandle` to forward to the native view ref. Check the SDK 58 docs for the exact view-function syntax before writing it.
- **Native-side buffering.** `append` pushes into a pending buffer on the native view. A frame-synced flush (Android `Choreographer`, iOS `CADisplayLink`) applies the buffer, at most once per frame and capped by `maxFps`: add entries, trim to `maxPoints`, one `notifyDataSetChanged` plus invalidate, then `moveViewToX` if `followLatest`.
- **Trimming.** Drop the oldest entries past `maxPoints` on the native side.
- **Later options.** Optional decimation for long histories. Batched typed arrays across the bridge if per-call overhead shows up in profiling.

Declared decisions for gotchas:
- **Formatters are declarative:** `{ type: 'number', decimals, prefix }`, `{ type: 'date', pattern }`, `{ type: 'labels', values }`.
- **Time series:** MPAndroidChart stores x as a 32-bit float, so epoch milliseconds lose precision. Use `xAxis.timeReference` and send x as an offset.
- **Markers:** built-in text template only (`marker: { template: '{x}: {y}' }`). No React Native views inside charts.
- **Left out:** rounded bar corners (native on iOS; the Android fork has a RoundedBar renderer since 3.1.0.23, so revisit once Bar exists), `saveToGallery` (Android only, permission-heavy; `snapshot()` covers it). Gradient fills are v1.1.

## 8. Dev workflow

- **Machines:** Windows laptop (cmd.exe) for TypeScript and Android, Mac (zsh) for iOS.
- **Node:** 22.x via nvm. Node 24 made `create-expo-module` spin forever, and Node 20 fails SDK 58's engine requirements.
- **VS Code:** TypeScript, example app, config. `npm run build` is the tsc **watch**; `npm run prepare` compiles once. The example imports the compiled `build/`, not `src`.
- **Android Studio:** open `example/android` (generated by `npx expo prebuild --platform android`). The module appears as the `expo-flash-charts` Gradle module and its files are the real repo files. Rebuild and run from Studio. Don't accept the AGP Upgrade Assistant, since `prebuild` regenerates that folder.
- **Xcode:** `pod install` in `example/ios`, then open the `.xcworkspace`. New Swift files only show up after re-running `pod install`.
- **Metro:** `npx expo start --dev-client` in `example`. JS changes hot-reload, native changes need a rebuild.
- **Commits:** through the VS Code UI, one commit per finished step.

## 9. Roadmap

- [x] Scaffold published to GitHub (apple + android, MIT, 0.1.0)
- [x] Example app wired, Android Studio Gradle sync passing
- [x] LineChart TypeScript contract (draft)
- [ ] Android LineChart, in increments, each tested in the example app: (1) datasets render, (2) axes, (3) legend and touch, (4) events, (5) ref methods, (6) streaming plus stress screen
- [ ] iOS LineChart parity (Swift, on the Mac)
- [ ] Second chart (BarChart). Extract the shared layer from what repeats.
- [ ] PieChart, ScatterChart, CandleStickChart, HorizontalBarChart
- [ ] Web fallback stubs, README with the parity matrix, release to npm

## 10. Open questions

- SDK 58 syntax for view-scoped `AsyncFunction`, and whether typed arrays are worth using for append batches.
- Whether consuming apps get the JitPack repository automatically or need a config plugin.
- Verify the AppDevNext fork 3.1.0.23 keeps the `com.github.mikephil.charting` package (check External Libraries after the Gradle sync). Stay off the Kotlin-conversion lines that rename it to `info.appdev.charting`. If the package differs, fall back to `com.github.PhilJay:MPAndroidChart:v3.1.0`.
- Both Android options are stagnant. Keep the chart engine behind the thin mapping layer so it can be swapped later, and say so in the README.
- DGCharts version constraint (`~> 5.1` assumed). Confirm at the first `pod install`.
- Keep tvOS in the podspec, or drop it.