package com.amirgazerani.flashcharts.line.mappers

import com.amirgazerani.flashcharts.line.records.TouchRecord
import com.github.mikephil.charting.charts.BarLineChartBase

/** Reset-then-apply: every setting is written on every call. */
internal fun applyTouch(chart: BarLineChartBase<*>, config: TouchRecord?) {
    val highlight = config?.highlight ?: true
    chart.isHighlightPerTapEnabled = highlight
    chart.isHighlightPerDragEnabled = highlight
    chart.isDragEnabled = config?.drag ?: true
    chart.setScaleEnabled(config?.pinchZoom ?: true)
    chart.isDoubleTapToZoomEnabled = config?.doubleTapZoom ?: true
}