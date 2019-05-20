requirejs.config({
  baseUrl: 'js/vendor',
  paths: {
    modules: '../modules',
    helpers: '../helpers',
  },
  shim: {
    'modernizr-custom': {
      exports: 'Modernizr'
    },
    'cssua': {
      exports: 'cssua'
    }
  }
})

requirejs([
'jquery.min','cssua', 'modules/intro', 'helpers/workers', 'modules/projects'
], function(
    $, cssua, Intro, Workers, Projects
){
  Workers.registerWorker();
  Intro.init();
  Projects.init();
})
