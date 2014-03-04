'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var EasyWebappGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic BasicWebapp generator.'));

    var prompts = [{
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to use SASS Bootstrap?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.bootstrap = props.bootstrap;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('css');
    this.mkdir('git-hooks');
    this.mkdir('images');
    this.mkdir('sass');
    this.mkdir('sass/_partials');
    this.mkdir('scripts');

    this.copy('_package.json', 'package.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');

    //Setup the git-hooks, will only setup correctly on a git repo
    this.copy('git-hooks/post-merge', 'git-hooks/post-merge');
    this.copy('git-hooks/pre-commit', 'git-hooks/pre-commit');

    //Copy basic JS file
    this.copy('scripts/main.js', 'scripts/main.js');

    //Copy core SASS files
    this.copy('sass/_partials/_variables.scss', 'sass/_partials/_variables.scss');
    this.copy('sass/_partials/_typography.scss', 'sass/_partials/_typography.scss');

    if(this.bootstrap){
      this.copy('_bower_bootstrap.json','bower.json');
      this.copy('sass/bootstrap.scss', 'sass/main.scss');
    }
    else{
      this.copy('_bower_boilerplate.json','bower.json');
      this.copy('sass/boilerplate.scss', 'sass/main.scss');
    }
    
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = EasyWebappGenerator;