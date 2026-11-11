package com.amirgazerani.flashcharts.line

import com.github.mikephil.charting.components.AxisBase
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.components.YAxis

private const val DEFAULT_LABEL_COUNT = 6

/** Reset-then-apply: every setting is written on every call, so removing a prop restores defaults. */
internal fun applyXAxis(axis: XAxis, config: XAxisRecord?) {
    applyAxisSettings(
        axis = axis,
        enabled = config?.enabled ?: true,
        gridLines = config?.gridLines ?: true,
        min = config?.min,
        max = config?.max,
        labelCount = config?.labelCount,
        granularity = config?.granularity
    )
    axis.position = when (config?.position) {
        AxisPosition.TOP -> XAxis.XAxisPosition.TOP
        else -> XAxis.XAxisPosition.BOTTOM
    }
}

internal fun applyYAxis(
    axis: YAxis,
    config: YAxisRecord?,
    defaultEnabled: Boolean,
    defaultGridLines: Boolean
) {
    applyAxisSettings(
        axis = axis,
        enabled = config?.enabled ?: defaultEnabled,
        gridLines = config?.gridLines ?: defaultGridLines,
        min = config?.min,
        max = config?.max,
        labelCount = config?.labelCount,
        granularity = config?.granularity
    )
}

// XAxis and YAxis share the base class AxisBase, so one helper serves both.
private fun applyAxisSettings(
    axis: AxisBase,
    enabled: Boolean,
    gridLines: Boolean,
    min: Float?,
    max: Float?,
    labelCount: Int?,
    granularity: Float?
) {
    axis.isEnabled = enabled
    axis.setDrawGridLines(gridLines)

    if (min != null) axis.axisMinimum = min else axis.resetAxisMinimum()
    if (max != null) axis.axisMaximum = max else axis.resetAxisMaximum()

    axis.setLabelCount(labelCount ?: DEFAULT_LABEL_COUNT, false)

    if (granularity != null) {
        axis.granularity = granularity
        axis.isGranularityEnabled = true
    } else {
        axis.isGranularityEnabled = false
    }
}