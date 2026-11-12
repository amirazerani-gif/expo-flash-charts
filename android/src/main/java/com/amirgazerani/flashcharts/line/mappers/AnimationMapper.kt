package com.amirgazerani.flashcharts.line.mappers

import com.amirgazerani.flashcharts.line.records.AnimationAxis
import com.amirgazerani.flashcharts.line.records.AnimationEasing
import com.amirgazerani.flashcharts.line.records.AnimationRecord
import com.github.mikephil.charting.animation.Easing
import com.github.mikephil.charting.charts.Chart

private const val DEFAULT_DURATION_MS = 800

/**
 * Starts the build-up animation. Returns false when animation is off, so the caller can just redraw.
 * Animation is an action, not a setting, so there is nothing to reset.
 */
internal fun playAnimation(chart: Chart<*>, config: AnimationRecord?): Boolean {
    if (config == null) return false

    val duration = config.duration ?: DEFAULT_DURATION_MS
    if (duration <= 0) return false

    val easing = toLibraryEasing(config.easing ?: AnimationEasing.EASE_OUT_CUBIC)
    when (config.axis ?: AnimationAxis.Y) {
        AnimationAxis.X -> chart.animateX(duration, easing)
        AnimationAxis.Y -> chart.animateY(duration, easing)
        AnimationAxis.XY -> chart.animateXY(duration, duration, easing, easing)
    }
    return true
}

private fun toLibraryEasing(easing: AnimationEasing): Easing.EasingFunction = when (easing) {
    AnimationEasing.LINEAR -> Easing.Linear
    AnimationEasing.EASE_IN_QUAD -> Easing.EaseInQuad
    AnimationEasing.EASE_OUT_QUAD -> Easing.EaseOutQuad
    AnimationEasing.EASE_IN_OUT_QUAD -> Easing.EaseInOutQuad
    AnimationEasing.EASE_IN_CUBIC -> Easing.EaseInCubic
    AnimationEasing.EASE_OUT_CUBIC -> Easing.EaseOutCubic
    AnimationEasing.EASE_IN_OUT_CUBIC -> Easing.EaseInOutCubic
    AnimationEasing.EASE_IN_QUART -> Easing.EaseInQuart
    AnimationEasing.EASE_OUT_QUART -> Easing.EaseOutQuart
    AnimationEasing.EASE_IN_OUT_QUART -> Easing.EaseInOutQuart
    AnimationEasing.EASE_IN_SINE -> Easing.EaseInSine
    AnimationEasing.EASE_OUT_SINE -> Easing.EaseOutSine
    AnimationEasing.EASE_IN_OUT_SINE -> Easing.EaseInOutSine
    AnimationEasing.EASE_IN_EXPO -> Easing.EaseInExpo
    AnimationEasing.EASE_OUT_EXPO -> Easing.EaseOutExpo
    AnimationEasing.EASE_IN_OUT_EXPO -> Easing.EaseInOutExpo
    AnimationEasing.EASE_IN_CIRC -> Easing.EaseInCirc
    AnimationEasing.EASE_OUT_CIRC -> Easing.EaseOutCirc
    AnimationEasing.EASE_IN_OUT_CIRC -> Easing.EaseInOutCirc
    AnimationEasing.EASE_IN_BOUNCE -> Easing.EaseInBounce
    AnimationEasing.EASE_OUT_BOUNCE -> Easing.EaseOutBounce
    AnimationEasing.EASE_IN_OUT_BOUNCE -> Easing.EaseInOutBounce
}