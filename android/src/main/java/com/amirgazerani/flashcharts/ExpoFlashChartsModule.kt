package com.amirgazerani.flashcharts

import com.amirgazerani.flashcharts.line.FlashLineChartView
import com.amirgazerani.flashcharts.line.records.AnimationRecord
import com.amirgazerani.flashcharts.line.records.LegendRecord
import com.amirgazerani.flashcharts.line.records.LineDatasetRecord
import com.amirgazerani.flashcharts.line.records.TouchRecord
import com.amirgazerani.flashcharts.line.records.XAxisRecord
import com.amirgazerani.flashcharts.line.records.YAxisRecord
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
      Prop("legend") { view: FlashLineChartView, value: LegendRecord? ->
        view.setLegend(value)
      }
      Prop("touch") { view: FlashLineChartView, value: TouchRecord? ->
        view.setTouch(value)
      }
      Prop("animation") { view: FlashLineChartView, value: AnimationRecord? ->
        view.setAnimation(value)
      }

      OnViewDidUpdateProps { view: FlashLineChartView ->
        view.applyPendingChanges()
      }
    }
  }
}