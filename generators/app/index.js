/*
 * @author: Mayank Gupta
 */

'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    mkdirp = require('mkdirp'),
    _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

    init: function() {
        //Run NPM Install when generator is done generating
        this.on('end', function() {
            if (!this.options['skip-install']) {
                this.npmInstall();
            }
        });

        //Greet user
        this.log(yosay(
            'Yo Yo Yo! Let\'s get started with ' + chalk.red('may-ang') + ' generator!'
        ));

    },

    /*
     *   Prompt user application based questions
     *   1) App Name?
     *   2) Author Name?
     *   3) Include default module (like landing page or something)?  
     */
    promptApplicationInfo: function() {
        var done = this.async();

        var prompts = [{
            name: 'appName',
            message: 'What you want to call your app?',
            default: 'angular-project'
        }, {
            name: 'author',
            message: 'What is the name of the author?'
        }, {
            name: 'defaultModule',
            message: 'Include default module?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            //slugish app name => if user enters "Hello World" it will be "hello-world"
            props.slugishAppName = _.slugify(props.appName)
                //camelize app name => result for "Hello World" will be "helloWorld"
            props.camelizeAppName = _.camelize(_.decapitalize(props.appName));
            this.rootAppFolder = props.camelizeAppName;
            // To access props later use this.props.someOption;
            this.props = props;
            done();

        }.bind(this));
    },

    /*  Prompt user to include most common angular modules
     *   1) Angular Cookies
     *   2) Angular Animate
     *   3) Angular Touch 
     *   4) Angulat Sanitize
     */
    promptModulesDependecies: function() {
        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'angularModules',
            message: 'Which AngularJS modules would you like to include?',
            choices: [{
                value: 'angularCookies',
                name: 'ngCookies',
                checked: true
            }, {
                value: 'angularAnimate',
                name: 'ngAnimate',
                checked: true
            }, {
                value: 'angularTouch',
                name: 'ngTouch',
                checked: true
            }, {
                value: 'angularSanitize',
                name: 'ngSanitize',
                checked: true
            }]
        }];

        this.prompt(prompts, function(props) {
            // To access props later use this.props.someOption;
            this.props.angularModules = props.angularModules;
            done();

        }.bind(this));
    },

    //Generate Folders
    scaffoldFolders: function() {
        //Application root folder
        var rootFolder = this.rootAppFolder;
        mkdirp(rootFolder);
        //Folder where all the build files will be kept
        mkdirp(rootFolder + '/build');
        //Test folder
        mkdirp(rootFolder + '/tests');
        //Application folder
        mkdirp(rootFolder + '/app');
        //Images and other assets go here
        mkdirp(rootFolder + '/app/assets');
        //All script file goes here 
        mkdirp(rootFolder + '/app/scripts');
        //Libraries included with bower
        mkdirp(rootFolder + '/app/scripts/vendors');
        //Application modules
        mkdirp(rootFolder + '/app/scripts/modules');
        //Custom Directives
        mkdirp(rootFolder + '/app/scripts/directives');
        //Custom filters
        mkdirp(rootFolder + '/app/scripts/filters');

        //All less files goes here
        mkdirp(rootFolder + '/app/styles');
        mkdirp(rootFolder + '/app/styles/less');
        mkdirp(rootFolder + '/app/styles/css');

    },

    copyRootFiles: function() {
        var props = this.props;
        //Package file
        this.fs.copy(
            this.templatePath('root/_package.json'),
            this.destinationPath(this.rootAppFolder + '/package.json')
        );
        //Bower and bowerrrc
        this.fs.copyTpl(
            this.templatePath('root/_bower.json'),
            this.destinationPath(this.rootAppFolder + '/bower.json'), {
                slugishAppName: props.slugishAppName,
                author: props.author,
                ngCookies: _.contains(props.angularModules, 'angularCookies'),
                ngAnimate: _.contains(props.angularModules, 'angularAnimate'),
                ngTouch: _.contains(props.angularModules, 'angularTouch'),
                ngSanitize: _.contains(props.angularModules, 'angularSanitize')
            }
        );
        this.fs.copy(
            this.templatePath('root/_bowerrc'),
            this.destinationPath(this.rootAppFolder + '/.bowerrc')
        );
        //Grunt file
        this.fs.copy(
            this.templatePath('root/_Gruntfile.js'),
            this.destinationPath(this.rootAppFolder + '/Gruntfile.js')
        );
        //jshintrc
        this.fs.copy(
            this.templatePath('root/_jshintrc'),
            this.destinationPath(this.rootAppFolder + '/.jshintrc')
        );
        //csslintrc
        this.fs.copy(
            this.templatePath('root/_csslintrc'),
            this.destinationPath(this.rootAppFolder + '/.csslintrc')
        );
        //gitignore
        this.fs.copy(
            this.templatePath('root/_gitignore'),
            this.destinationPath(this.rootAppFolder + '/.gitignore')
        );
    },

    copyAppFiles: function() {
        var props = this.props;

        //Copy Index File
        this.fs.copyTpl(
            this.templatePath('app/_index.html'),
            this.destinationPath(this.rootAppFolder + '/app/index.html'), {
                camelizeAppName: props.camelizeAppName
            }
        );

        //Copy application file
        this.fs.copy(
            this.templatePath('app/scripts/_application.js'),
            this.destinationPath(this.rootAppFolder +'/app/scripts/application.js')
        );

        //Copy config file
        this.fs.copyTpl(
            this.templatePath('app/scripts/_config.js'),
            this.destinationPath(this.rootAppFolder +'/app/scripts/config.js'), {
                camelizeAppName: props.camelizeAppName,
                appDependencies: props.angularModules
            }
        );

    },

    createBaseModule: function() {
        // this.composeWith('may-ang:module', { args: ['entry'] });
    }



});