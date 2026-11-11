package com.amirgazerani.flashcharts.line

import android.util.Log
import com.github.mikephil.charting.formatter.ValueFormatter
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.roundToInt

/**
 * Builds a chart-library formatter from a FormatRecord, or null for "use the library default".
 * `offset` is the x-axis timeReference: it is added back to the chart's value before formatting.
 */
internal fun buildFormatter(record: FormatRecord?, offset: Double = 0.0): ValueFormatter? {
    val r = record ?: return null
    return when (r.type) {
        FormatType.NUMBER -> NumberFormatter(r.decimals, r.prefix ?: "", r.suffix ?: "", offset)
        FormatType.DATE -> buildDateFormatter(r.pattern, offset)
        FormatType.LABELS -> LabelsFormatter(r.values ?: emptyList(), offset)
        null -> null
    }
}

private fun buildDateFormatter(pattern: String?, offset: Double): ValueFormatter? {
    if (pattern == null) return null
    return try {
        DateFormatter(SimpleDateFormat(pattern, Locale.US), offset)
    } catch (e: IllegalArgumentException) {
        Log.w("ExpoFlashCharts", "Invalid date pattern '$pattern', using default labels", e)
        null
    }
}

// All formatters work in real values. The offset is added back in exactly one place.
private abstract class OffsetFormatter(private val offset: Double) : ValueFormatter() {
    abstract fun format(value: Double): String

    override fun getFormattedValue(value: Float): String = format(value.toDouble() + offset)
}

private class NumberFormatter(
    decimals: Int?,
    private val prefix: String,
    private val suffix: String,
    offset: Double
) : OffsetFormatter(offset) {
    private val decimalFormat = DecimalFormat(
        when {
            decimals == null -> "0.##"
            decimals <= 0 -> "0"
            else -> "0." + "0".repeat(decimals)
        },
        DecimalFormatSymbols(Locale.US)
    )

    override fun format(value: Double): String = prefix + decimalFormat.format(value) + suffix
}

private class DateFormatter(
    private val dateFormat: SimpleDateFormat,
    offset: Double
) : OffsetFormatter(offset) {
    override fun format(value: Double): String = dateFormat.format(Date(value.toLong()))
}

private class LabelsFormatter(
    private val values: List<String>,
    offset: Double
) : OffsetFormatter(offset) {
    override fun format(value: Double): String = values.getOrNull(value.roundToInt()) ?: ""
}