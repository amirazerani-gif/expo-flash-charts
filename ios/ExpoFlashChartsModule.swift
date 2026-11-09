import ExpoModulesCore

public class ExpoFlashChartsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoFlashCharts")

    View(ExpoFlashChartsView.self) {
      Events("onTap")
    }
  }
}
