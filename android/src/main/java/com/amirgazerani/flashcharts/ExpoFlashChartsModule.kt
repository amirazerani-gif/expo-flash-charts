package com.amirgazerani.flashcharts

import com.amirgazerani.flashcharts.line.FlashLineChartView
import com.amirgazerani.flashcharts.line.LineDatasetRecord
import com.amirgazerani.flashcharts.line.XAxisRecord
import com.amirgazerani.flashcharts.line.YAxisRecord
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoFlashChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoFlashCharts")

    View(FlashLineChartView::class) {
      Prop("datasets") { view: FlashLineChartView, value: List<LineDatasetRecord> ->
        view.setDatasets(value)
      }
      Prop("xAxis") { view: FlashLineChartView, value: XAxisRecord? ->
        view.setXAxis(value)
      }
      Prop("yAxisLeft") { view: FlashLineChartView, value: YAxisRecord? ->
        view.setYAxisLeft(value)
      }
      Prop("yAxisRight") { view: FlashLineChartView, value: YAxisRecord? ->
        view.setYAxisRight(value)
      }
    }
  }
}