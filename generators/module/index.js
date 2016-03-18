'use strict';
var yeoman = require('yeoman-generator'),
    mkdirp = require('mkdirp'),
    _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });

        this.slugishModuleName = _.slugify(this.name)
        this.camelizeModuleName = _.camelize(_.decapitalize(this.name));

        this.log('Yo Yo Yo!!! You are creating a module with name, ' + this.name + '.');
    },

    //Ask User if they want to include
    //1) Template File
    //2) Controller
    //3) Service (TODO: Need better name)
    //4) Add Route to Module (TODO: Need better name)
    promptUser: function() {
        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'features',
            message: 'What would you like to have?',
            choices: [{
                value: 'template',
                name: 'Template File',
                checked: true
            }, {
                value: 'controller',
                name: 'Controller',
                checked: true
            }, {
                value: 'service',
                name: 'Service',
                checked: true
            }, {
                value: 'route',
                name: 'Add Route to Module',
                checked: true
            }]
        }];

        this.prompt(prompts, function(props) {
            // To access props later use this.props.someOption;
            if(!this.props){
              this.props = {};
            }
            this.props.angularFeatures = props.features;
            done();

        }.bind(this));

    },

    //Create folders
    scaffoldingFolders: function() {
        var props = this.props;

        //Module Folder
        mkdirp('app/scripts/modules/' + this.camelizeModuleName);

        //Tempalate Folder
        if (_.contains(props.angularFeatures, 'template'))
            mkdirp('app/scripts/modules/' + this.camelizeModuleName + '/templates');

        //Controller folder
        if (_.contains(props.angularFeatures, 'controller'))
            mkdirp('app/scripts/modules/' + this.camelizeModuleName + '/controllers');

        //Serive Folder
        if (_.contains(props.angularFeatures, 'service'))
            mkdirp('app/scripts/modules/' + this.camelizeModuleName + '/services');

        //Route Folder
        if (_.contains(props.angularFeatures, 'route'))
            mkdirp('app/scripts/modules/' + this.camelizeModuleName + '/configs');

    },

    //Create a module file which will register module with the app
    createModuleFile: function() {
        this.fs.copyTpl(
            this.templatePath('_module.js'),
            this.destinationPath('app/scripts/modules/' + this.camelizeModuleName + '/' + this.camelizeModuleName + '.module.js'), { moduleName: this.camelizeModuleName }
        );
    },

    //Template File
    //TODO: Add NG-Controller
    createTemplateFile: function() {
        if (_.contains(this.props.angularFeatures, 'template')) {
            this.fs.copyTpl(
                this.templatePath('_template.html'),
                this.destinationPath('app/scripts/modules/' + this.camelizeModuleName + '/templates/' + this.camelizeModuleName + '.template.html'), { moduleName: this.camelizeModuleName }
            );
        }
    },

    //Add Controller File
    createControllerFile: function() {
        if (_.contains(this.props.angularFeatures, 'controller')) {
            this.fs.copyTpl(
                this.templatePath('_controller.js'),
                this.destinationPath('app/scripts/modules/' + this.camelizeModuleName + '/controllers/' + this.camelizeModuleName + '.controller.js'), { moduleName: this.camelizeModuleName }
            );
        }
    },

    //Add Service File
    createServiceFile: function() {
        if (_.contains(this.props.angularFeatures, 'service')) {
            this.fs.copyTpl(
                this.templatePath('_service.js'),
                this.destinationPath('app/scripts/modules/' + this.camelizeModuleName + '/services/' + this.camelizeModuleName + '.service.js'), { moduleName: this.camelizeModuleName }
            );
        }
    },

    //Add config file including route to module
    createConfigFiles: function() {
        if (_.contains(this.props.angularFeatures, 'route')) {
            this.fs.copyTpl(
                this.templatePath('_config.js'),
                this.destinationPath('app/scripts/modules/' + this.camelizeModuleName + '/configs/' + this.camelizeModuleName + '.routes.js'), { moduleName: this.camelizeModuleName, moduleRoute: this.props.moduleRoute }
            );
        }
    }

});
