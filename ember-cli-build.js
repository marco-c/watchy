/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/brick/dist/brick.css');
  app.import('bower_components/font-awesome/css/font-awesome.css');
  //app.import('bower_components/normalize-css/normalize.css');

  app.import('vendor/trakt.js');

  app.import('vendor/gaia-2.0-bb/input_areas.css');
  app.import('vendor/gaia-2.0-bb/input_areas/images/clear.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/clear_dark.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/dialog.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/dialog_active.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/dialog_disabled.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/dialog_disabled_rtl.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/dialog_rtl.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/search.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/input_areas/images/search_dark.svg', {
    destDir: 'assets/input_areas/images'
  });
  app.import('vendor/gaia-2.0-bb/lists.css');
  app.import('vendor/gaia-2.0-bb/progress_activity.css');
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/activity.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/activity@1.5x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/activity@2.25x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/activity@2x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/default.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/default@1.5x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/default@2.25x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/default@2x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/light.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/light@1.5x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/light@2.25x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/progress_activity/images/ui/light@2x.png', {
      destDir: 'assets/progress_activity/images/ui'
  });
  app.import('vendor/gaia-2.0-bb/switches.css');
  app.import('vendor/gaia-2.0-bb/switches/images/check/default.png', {
    destDir: 'assets/switches/images/check'
  });
  app.import('vendor/gaia-2.0-bb/switches/images/check/default@1.5x.png', {
    destDir: 'assets/switches/images/check'
  });
  app.import('vendor/gaia-2.0-bb/switches/images/check/default@2.25x.png', {
    destDir: 'assets/switches/images/check'
  });
  app.import('vendor/gaia-2.0-bb/switches/images/check/default@2x.png', {
    destDir: 'assets/switches/images/check'
  });

  app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', {
    destDir: "fonts",
  });

  return app.toTree();
};
