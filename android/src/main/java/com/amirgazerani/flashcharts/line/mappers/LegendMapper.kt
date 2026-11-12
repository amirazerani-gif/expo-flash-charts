package com.amirgazerani.flashcharts.line.mappers

import com.amirgazerani.flashcharts.line.records.LegendAlign
import com.amirgazerani.flashcharts.line.records.LegendPosition
import com.amirgazerani.flashcharts.line.records.LegendRecord
import com.github.mikephil.charting.components.Legend

/** Reset-then-apply: every setting is written on every call. */
internal fun applyLegend(legend: Legend, config: LegendRecord?) {
    legend.isEnabled = config?.enabled ?: true
    legend.verticalAlignment = when (config?.position) {
        LegendPosition.TOP -> Legend.LegendVerticalAlignment.TOP
        else -> Legend.LegendVerticalAlignment.BOTTOM
    }
    legend.horizontalAlignment = when (config?.align) {
        LegendAlign.CENTER -> Legend.LegendHorizontalAlignment.CENTER
        LegendAlign.RIGHT -> Legend.LegendHorizontalAlignment.RIGHT
        else -> Legend.LegendHorizontalAlignment.LEFT
    }
    legend.orientation = Legend.LegendOrientation.HORIZONTAL
    legend.setDrawInside(false)
}