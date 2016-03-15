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
            'Welcome to the top-notch ' + chalk.red('may-ang') + ' generator!'
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
            name: 'appAuthor',
            message: 'What is the name of the author?'
        }, {
            name: 'defaultModule',
            message: 'Include default module?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            //slugish app name
            props.slugishAppName = _.slugify(props.appName)
            props.camelizeAppName = _.camelize(_.decapitalize(props.AppName));
            // To access props later use this.props.someOption;
            this.props = props;
            done();

        }.bind(this));
    },

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
        mkdirp('build');
        //test is not included yet
        //mkdirp('tests');
        mkdirp('app');
        //Images and other assets go here
        mkdirp('app/assets');
        //All script file goes here 
        mkdirp('app/scripts');
        mkdirp('app/scripts/vendors');
        mkdirp('app/scripts/modules');
        mkdirp('app/scripts/directives');

        //All less files goes here
        mkdirp('app/styles');
        mkdirp('app/styles/less');

    },

    copyFiles: function() {
        var props = this.props;

        this.fs.copyTpl(
            this.templatePath('app/_index.html'),
            this.destinationPath('app/index.html'), {
                camelizeAppName: props.camelizeAppName
            }
        );

        this.fs.copy(
            this.templatePath('app/scripts/_application.js'),
            this.destinationPath('app/scripts/application.js')
        );
        this.fs.copyTpl(
            this.templatePath('app/scripts/_config.js'),
            this.destinationPath('app/scripts/config.js'), {
                camelizeAppName: props.camelizeAppName,
                appDependencies: props.angularModules
            }
        );

        this.fs.copyTpl(
            this.templatePath('_bower.json'),
            this.destinationPath('bower.json'), {
                slugishAppName: props.slugishAppName,
                ngCookies: _.contains(props.angularModules, 'angularCookies'),
                ngAnimate: _.contains(props.angularModules, 'angularAnimate'),
                ngTouch: _.contains(props.angularModules, 'angularTouch'),
                ngSanitize: _.contains(props.angularModules, 'angularSanitize')
            }
        );

    },

    createBaseModule: function() {
        this.composeWith('may-ang:module', { args: ['entry'] });
    }



});