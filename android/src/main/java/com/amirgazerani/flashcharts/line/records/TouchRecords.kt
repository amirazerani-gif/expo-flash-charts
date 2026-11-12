package com.amirgazerani.flashcharts.line.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class TouchRecord : Record {
    @Field val highlight: Boolean? = null
    @Field val drag: Boolean? = null
    @Field val pinchZoom: Boolean? = null
    @Field val doubleTapZoom: Boolean? = null
}