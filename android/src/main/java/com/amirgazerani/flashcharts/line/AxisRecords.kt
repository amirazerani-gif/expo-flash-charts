package com.amirgazerani.flashcharts.line

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

enum class AxisPosition(val value: String) : Enumerable {
    TOP("top"),
    BOTTOM("bottom")
}

class XAxisRecord : Record {
    @Field val enabled: Boolean? = null
    @Field val position: AxisPosition? = null
    // Double, not Float: a real timestamp does not fit in a 32-bit float.
    @Field val min: Double? = null
    @Field val max: Double? = null
    @Field val labelCount: Int? = null
    @Field val granularity: Float? = null
    @Field val gridLines: Boolean? = null
    @Field val format: FormatRecord? = null
    @Field val timeReference: Double? = null
}

class YAxisRecord : Record {
    @Field val enabled: Boolean? = null
    @Field val min: Float? = null
    @Field val max: Float? = null
    @Field val labelCount: Int? = null
    @Field val granularity: Float? = null
    @Field val gridLines: Boolean? = null
    @Field val format: FormatRecord? = null
}