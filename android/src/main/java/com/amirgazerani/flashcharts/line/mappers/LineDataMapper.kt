package com.amirgazerani.flashcharts.line.mappers

import android.graphics.Color
import com.amirgazerani.flashcharts.line.records.AxisSide
import com.amirgazerani.flashcharts.line.records.LineDatasetRecord
import com.amirgazerani.flashcharts.line.records.LineMode
import com.github.mikephil.charting.components.YAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet

private val palette = intArrayOf(
    Color.parseColor("#4F46E5"),
    Color.parseColor("#F59E0B"),
    Color.parseColor("#10B981"),
    Color.parseColor("#EF4444")
)

/** Records from JS -> MPAndroidChart data objects. Defaults for data styling live here. */
internal fun buildLineData(datasets: List<LineDatasetRecord>, timeReference: Double): LineData {
    val sets = datasets.mapIndexed { index, ds ->
        // Subtract in Double precision, then convert: the chart only ever sees small offsets.
        val entries = ds.data.map { Entry((it.x - timeReference).toFloat(), it.y.toFloat()) }
        LineDataSet(entries, ds.label ?: "").apply {
            val c = ds.color ?: palette[index % palette.size]
            color = c
            setCircleColor(c)
            lineWidth = ds.lineWidth ?: 2f
            setDrawCircles(ds.circles ?: false)
            setDrawValues(ds.drawValues ?: false)
            buildFormatter(ds.valueFormat)?.let { valueFormatter = it }
            setDrawFilled(ds.fill ?: false)
            fillColor = c
            fillAlpha = 64
            axisDependency = if (ds.axis == AxisSide.RIGHT) {
                YAxis.AxisDependency.RIGHT
            } else {
                YAxis.AxisDependency.LEFT
            }
            mode = when (ds.mode) {
                LineMode.CUBIC -> LineDataSet.Mode.CUBIC_BEZIER
                LineMode.STEPPED -> LineDataSet.Mode.STEPPED
                else -> LineDataSet.Mode.LINEAR
            }
        }
    }
    return LineData(sets)
}