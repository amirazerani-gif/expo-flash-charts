package com.amirgazerani.flashcharts.line

import android.content.Context
import android.graphics.Color
import android.view.ViewGroup
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class FlashLineChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    // Let Android measure and lay out the chart child instead of React Native's layout engine.
    override val shouldUseAndroidLayout = true

    private val palette = intArrayOf(
        Color.parseColor("#4F46E5"),
        Color.parseColor("#F59E0B"),
        Color.parseColor("#10B981"),
        Color.parseColor("#EF4444")
    )

    private val chart = LineChart(context).apply {
        layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        description.isEnabled = false
        axisRight.isEnabled = false
        xAxis.position = XAxis.XAxisPosition.BOTTOM
        setNoDataText("")
    }

    init {
        addView(chart)
    }

    fun setDatasets(datasets: List<LineDatasetRecord>) {
        val sets = datasets.mapIndexed { index, ds ->
            val entries = ds.data.map { Entry(it.x.toFloat(), it.y.toFloat()) }
            LineDataSet(entries, ds.label ?: "").apply {
                val c = ds.color ?: palette[index % palette.size]
                color = c
                setCircleColor(c)
                lineWidth = ds.lineWidth ?: 2f
                setDrawCircles(ds.circles ?: false)
                setDrawValues(ds.drawValues ?: false)
                setDrawFilled(ds.fill ?: false)
                fillColor = c
                fillAlpha = 64
                mode = when (ds.mode) {
                    LineMode.CUBIC -> LineDataSet.Mode.CUBIC_BEZIER
                    LineMode.STEPPED -> LineDataSet.Mode.STEPPED
                    else -> LineDataSet.Mode.LINEAR
                }
            }
        }
        chart.data = LineData(sets)
        chart.invalidate()
    }
}