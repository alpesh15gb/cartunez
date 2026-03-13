const { withProjectBuildGradle, withSettingsGradle, createRunOncePlugin } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to fix Gradle 9 repository declaration issues.
 * It moves repository declarations from build.gradle (allprojects) 
 * to settings.gradle (dependencyResolutionManagement).
 */
const withGradleFix = (config) => {
  // 1. Modify android/build.gradle to remove allprojects { repositories { ... } }
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const allProjectsText = config.modResults.contents;
      const updatedText = allProjectsText.replace('allprojects {', '/* allprojects {')
                                         .replace('apply plugin', '} */\napply plugin');
      config.modResults.contents = updatedText;
    }
    return config;
  });

  // 2. Modify android/settings.gradle to add dependencyResolutionManagement
  config = withSettingsGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const depManagement = `
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
`;
      if (!config.modResults.contents.includes('dependencyResolutionManagement')) {
          config.modResults.contents += depManagement;
      }
    }
    return config;
  });

  return config;
};

module.exports = createRunOncePlugin(withGradleFix, 'withGradleFix', '1.0.0');
