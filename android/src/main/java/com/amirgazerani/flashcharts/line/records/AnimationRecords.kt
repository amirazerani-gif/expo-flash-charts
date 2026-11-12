package com.amirgazerani.flashcharts.line.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

enum class AnimationAxis(val value: String) : Enumerable {
    X("x"),
    Y("y"),
    XY("xy")
}

enum class AnimationEasing(val value: String) : Enumerable {
    LINEAR("linear"),
    EASE_IN_QUAD("easeInQuad"),
    EASE_OUT_QUAD("easeOutQuad"),
    EASE_IN_OUT_QUAD("easeInOutQuad"),
    EASE_IN_CUBIC("easeInCubic"),
    EASE_OUT_CUBIC("easeOutCubic"),
    EASE_IN_OUT_CUBIC("easeInOutCubic"),
    EASE_IN_QUART("easeInQuart"),
    EASE_OUT_QUART("easeOutQuart"),
    EASE_IN_OUT_QUART("easeInOutQuart"),
    EASE_IN_SINE("easeInSine"),
    EASE_OUT_SINE("easeOutSine"),
    EASE_IN_OUT_SINE("easeInOutSine"),
    EASE_IN_EXPO("easeInExpo"),
    EASE_OUT_EXPO("easeOutExpo"),
    EASE_IN_OUT_EXPO("easeInOutExpo"),
    EASE_IN_CIRC("easeInCirc"),
    EASE_OUT_CIRC("easeOutCirc"),
    EASE_IN_OUT_CIRC("easeInOutCirc"),
    EASE_IN_BOUNCE("easeInBounce"),
    EASE_OUT_BOUNCE("easeOutBounce"),
    EASE_IN_OUT_BOUNCE("easeInOutBounce")
}

class AnimationRecord : Record {
    @Field val duration: Int? = null
    @Field val axis: AnimationAxis? = null
    @Field val easing: AnimationEasing? = null
}