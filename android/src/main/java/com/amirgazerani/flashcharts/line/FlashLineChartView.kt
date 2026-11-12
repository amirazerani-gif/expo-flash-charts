package com.amirgazerani.flashcharts.line

import android.content.Context
import android.view.ViewGroup
import com.amirgazerani.flashcharts.line.mappers.applyLegend
import com.amirgazerani.flashcharts.line.mappers.applyTouch
import com.amirgazerani.flashcharts.line.mappers.applyXAxis
import com.amirgazerani.flashcharts.line.mappers.applyYAxis
import com.amirgazerani.flashcharts.line.mappers.buildLineData
import com.amirgazerani.flashcharts.line.mappers.playAnimation
import com.amirgazerani.flashcharts.line.records.AnimationRecord
import com.amirgazerani.flashcharts.line.records.AxisSide
import com.amirgazerani.flashcharts.line.records.LegendRecord
import com.amirgazerani.flashcharts.line.records.LineDatasetRecord
import com.amirgazerani.flashcharts.line.records.TouchRecord
import com.amirgazerani.flashcharts.line.records.XAxisRecord
import com.amirgazerani.flashcharts.line.records.YAxisRecord
import com.github.mikephil.charting.charts.LineChart
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class FlashLineChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    // Let Android measure and lay out the chart child instead of React Native's layout engine.
    override val shouldUseAndroidLayout = true

    // The latest value of every prop. Props arrive one at a time in no fixed order.
    private var datasets: List<LineDatasetRecord> = emptyList()
    private var xAxisConfig: XAxisRecord? = null
    private var yAxisLeftConfig: YAxisRecord? = null
    private var yAxisRightConfig: YAxisRecord? = null
    private var legendConfig: LegendRecord? = null
    private var touchConfig: TouchRecord? = null
    private var animationConfig: AnimationRecord? = null

    // What changed since the last apply. Legend and touch start dirty so our defaults
    // are written even when the user never passes those props.
    private var dataDirty = false
    private var axesDirty = false
    private var legendDirty = true
    private var touchDirty = true

    private val chart = LineChart(context).apply {
        layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        description.isEnabled = false
        setNoDataText("")
    }

    init {
        addView(chart)
    }

    private val timeReference: Double
        get() = xAxisConfig?.timeReference ?: 0.0

    // Prop setters only store the value and mark what needs re-applying.

    fun setDatasets(value: List<LineDatasetRecord>) {
        datasets = value
        dataDirty = true
        axesDirty = true // the right axis can turn on or off depending on the datasets
    }

    fun setXAxis(value: XAxisRecord?) {
        // The data is stored as offsets from timeReference, so a new reference means a rebuild.
        if ((value?.timeReference ?: 0.0) != timeReference) dataDirty = true
        xAxisConfig = value
        axesDirty = true
    }

    fun setYAxisLeft(value: YAxisRecord?) {
        yAxisLeftConfig = value
        axesDirty = true
    }

    fun setYAxisRight(value: YAxisRecord?) {
        yAxisRightConfig = value
        axesDirty = true
    }

    fun setLegend(value: LegendRecord?) {
        legendConfig = value
        legendDirty = true
    }

    fun setTouch(value: TouchRecord?) {
        touchConfig = value
        touchDirty = true
    }

    // Animation is an action, not a setting: store it, play it when new data is applied.
    fun setAnimation(value: AnimationRecord?) {
        animationConfig = value
    }

    /** Called once by Expo after a whole batch of props has been set. */
    fun applyPendingChanges() {
        if (!dataDirty && !axesDirty && !legendDirty && !touchDirty) return

        val dataChanged = dataDirty
        if (dataDirty) refreshData()
        if (axesDirty) refreshAxes()
        if (legendDirty) applyLegend(chart.legend, legendConfig)
        if (touchDirty) applyTouch(chart, touchConfig)
        dataDirty = false
        axesDirty = false
        legendDirty = false
        touchDirty = false

        chart.notifyDataSetChanged() // recompute ranges, offsets and legend from the settings above

        val animated = dataChanged && playAnimation(chart, animationConfig)
        if (!animated) chart.invalidate()
    }

    private fun refreshData() {
        if (datasets.isEmpty()) chart.clear() else chart.data = buildLineData(datasets, timeReference)
    }

    private fun refreshAxes() {
        val usesRightAxis = datasets.any { it.axis == AxisSide.RIGHT }
        applyXAxis(chart.xAxis, xAxisConfig)
        applyYAxis(chart.axisLeft, yAxisLeftConfig, defaultEnabled = true, defaultGridLines = true)
        applyYAxis(chart.axisRight, yAxisRightConfig, defaultEnabled = usesRightAxis, defaultGridLines = false)
    }
}