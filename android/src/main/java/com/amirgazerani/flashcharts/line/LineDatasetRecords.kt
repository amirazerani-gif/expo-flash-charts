package com.amirgazerani.flashcharts.line

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

enum class LineMode(val value: String) : Enumerable {
    LINEAR("linear"),
    CUBIC("cubic"),
    STEPPED("stepped")
}

enum class AxisSide(val value: String) : Enumerable {
    LEFT("left"),
    RIGHT("right")
}

class PointRecord : Record {
    @Field val x: Double = 0.0
    @Field val y: Double = 0.0
}

class LineDatasetRecord : Record {
    @Field val label: String? = null
    @Field val data: List<PointRecord> = emptyList()
    @Field val color: Int? = null
    @Field val lineWidth: Float? = null
    @Field val mode: LineMode? = null
    @Field val fill: Boolean? = null
    @Field val circles: Boolean? = null
    @Field val drawValues: Boolean? = null
    @Field val axis: AxisSide? = null
}