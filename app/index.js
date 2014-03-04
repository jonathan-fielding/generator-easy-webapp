'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var util=require('util');
var exec=require('child_process').exec;

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
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Would you initialise a new Git repo?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      var newPrompts = [];

      this.bootstrap = props.bootstrap;
      this.initGit = props.initGit;

      if(this.initGit){
        newPrompts.push({
          name: 'gitRepoURL',
          message: 'What is the URL to repository?',
          default: ''
        });
      }


      this.prompt(newPrompts, function (localProps) {
        if(this.initGit){
          this.gitRepoURL = localProps.gitRepoURL;
        }

        done();
      }.bind(this));


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
    this.copy('gitignore', '.gitignore');

    //Setup the git hooks grunt expects
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

    if(this.initGit){
      
      exec('git init', function(){
        //Setup the git-hooks for the new repo
        this.copy('git-hooks/post-merge', '.git/hooks/post-merge');
        this.copy('git-hooks/pre-commit', '.git/hooks/pre-commit');

        exec('git add .',function(){
          exec('git commit -m "initial commit"',function(){
            if(this.gitRepoURL !== ''){
              exec('git remote add origin '+this.gitRepoURL, function(){
                exec('git push -u origin master');
              }.bind(this));
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));

    }
    
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = EasyWebappGenerator;