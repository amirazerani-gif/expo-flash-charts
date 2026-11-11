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
    @Field val min: Float? = null
    @Field val max: Float? = null
    @Field val labelCount: Int? = null
    @Field val granularity: Float? = null
    @Field val gridLines: Boolean? = null
}

class YAxisRecord : Record {
    @Field val enabled: Boolean? = null
    @Field val min: Float? = null
    @Field val max: Float? = null
    @Field val labelCount: Int? = null
    @Field val granularity: Float? = null
    @Field val gridLines: Boolean? = null
}