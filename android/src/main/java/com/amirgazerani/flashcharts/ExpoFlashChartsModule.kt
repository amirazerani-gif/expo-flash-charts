package com.amirgazerani.flashcharts

import com.amirgazerani.flashcharts.line.FlashLineChartView
import com.amirgazerani.flashcharts.line.LineDatasetRecord
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoFlashChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoFlashCharts")

    View(FlashLineChartView::class) {
      Prop("datasets") { view: FlashLineChartView, datasets: List<LineDatasetRecord> ->
        view.setDatasets(datasets)
      }
    }
  }
}