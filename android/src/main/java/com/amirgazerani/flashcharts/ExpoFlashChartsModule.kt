package com.amirgazerani.flashcharts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoFlashChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoFlashCharts")

    View(ExpoFlashChartsView::class) {
      // Defines an event that the view can send to JavaScript.
      Events("onTap")
    }
  }
}
