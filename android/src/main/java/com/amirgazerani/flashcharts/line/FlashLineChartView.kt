package com.amirgazerani.flashcharts.line

import android.content.Context
import android.view.ViewGroup
import com.amirgazerani.flashcharts.line.mappers.applyXAxis
import com.amirgazerani.flashcharts.line.mappers.applyYAxis
import com.amirgazerani.flashcharts.line.mappers.buildLineData
import com.amirgazerani.flashcharts.line.records.AxisSide
import com.amirgazerani.flashcharts.line.records.LineDatasetRecord
import com.amirgazerani.flashcharts.line.records.XAxisRecord
import com.amirgazerani.flashcharts.line.records.YAxisRecord
import com.github.mikephil.charting.charts.LineChart
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class FlashLineChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    // Let Android measure and lay out the chart child instead of React Native's layout engine.
    override val shouldUseAndroidLayout = true

    // The latest value of every prop. Props arrive one at a time in no fixed order,
    // so the view keeps them and always re-applies from this state.
    private var datasets: List<LineDatasetRecord> = emptyList()
    private var xAxisConfig: XAxisRecord? = null
    private var yAxisLeftConfig: YAxisRecord? = null
    private var yAxisRightConfig: YAxisRecord? = null

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

    // Prop setters: store the new value, then re-apply.

    fun setDatasets(value: List<LineDatasetRecord>) {
        datasets = value
        refreshData()
        refreshAxes() // the right axis can turn on or off depending on the datasets
    }

    fun setXAxis(value: XAxisRecord?) {
        val referenceChanged = (value?.timeReference ?: 0.0) != timeReference
        xAxisConfig = value
        // The data is stored as offsets from timeReference, so a new reference means a rebuild.
        if (referenceChanged) refreshData()
        refreshAxes()
    }

    fun setYAxisLeft(value: YAxisRecord?) {
        yAxisLeftConfig = value
        refreshAxes()
    }

    fun setYAxisRight(value: YAxisRecord?) {
        yAxisRightConfig = value
        refreshAxes()
    }

    private fun refreshData() {
        if (datasets.isEmpty()) chart.clear() else chart.data =
            buildLineData(datasets, timeReference)
    }

    private fun refreshAxes() {
        val usesRightAxis = datasets.any { it.axis == AxisSide.RIGHT }
        applyXAxis(chart.xAxis, xAxisConfig)
        applyYAxis(chart.axisLeft, yAxisLeftConfig, defaultEnabled = true, defaultGridLines = true)
        applyYAxis(
            chart.axisRight,
            yAxisRightConfig,
            defaultEnabled = usesRightAxis,
            defaultGridLines = false
        )
        chart.notifyDataSetChanged() // recompute ranges and offsets after axis changes
        chart.invalidate()           // redraw
    }
}