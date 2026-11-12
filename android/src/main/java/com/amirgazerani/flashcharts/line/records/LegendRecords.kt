package com.amirgazerani.flashcharts.line.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

enum class LegendPosition(val value: String) : Enumerable {
    TOP("top"),
    BOTTOM("bottom")
}

enum class LegendAlign(val value: String) : Enumerable {
    LEFT("left"),
    CENTER("center"),
    RIGHT("right")
}

class LegendRecord : Record {
    @Field val enabled: Boolean? = null
    @Field val position: LegendPosition? = null
    @Field val align: LegendAlign? = null
}