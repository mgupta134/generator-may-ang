'use strict';
var yeoman = require('yeoman-generator'),
    mkdirp = require('mkdirp'),
    _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The subgenerator name'
    });

    this.slugishModuleName = _.slugify(this.name)
    this.camelizeModuleName = _.camelize(_.decapitalize(this.name));

    this.log('You called the MayAng subgenerator with the argument ' + this.name + '.');
  },

  getRouteUrl : function(){
    console.log(this.name)
    var done = this.async();
    var prompts = [{
      name: 'moduleRoute',
      message: 'What would you like to be this module url?',
      default : '/'+this.name
    }];

    this.prompt(prompts, function (props) {
      // To access props later use this.props.someOption;
      this.props = props;
      done();

    }.bind(this));
  },

  scaffoldingFolders: function(){
    mkdirp('app/scripts/modules/'+this.camelizeModuleName);
    mkdirp('app/scripts/modules/'+this.camelizeModuleName + '/configs');
    mkdirp('app/scripts/modules/'+this.camelizeModuleName + '/controllers');
    mkdirp('app/scripts/modules/'+this.camelizeModuleName + '/services');
    mkdirp('app/scripts/modules/'+this.camelizeModuleName + '/templates');
  },

  createModuleFile: function(){
    this.fs.copyTpl(
      this.templatePath('_module.js'),
      this.destinationPath('app/scripts/modules/'+this.camelizeModuleName+'/'+this.camelizeModuleName+'.module.js'),
      {moduleName: this.camelizeModuleName}
    );
  },

  createConfigFiles: function(){
    this.fs.copyTpl(
      this.templatePath('_config.js'),
      this.destinationPath('app/scripts/modules/'+this.camelizeModuleName+'/configs/'+this.camelizeModuleName+'.routes.js'),
      {moduleName: this.camelizeModuleName, moduleRoute: this.props.moduleRoute}
    );
  },

  createControllerFile: function(){
    this.fs.copyTpl(
      this.templatePath('_controller.js'),
      this.destinationPath('app/scripts/modules/'+this.camelizeModuleName+'/controllers/'+this.camelizeModuleName+'.controller.js'),
      {moduleName: this.camelizeModuleName}
    );
  },

  createServiceFile: function(){
    this.fs.copyTpl(
      this.templatePath('_service.js'),
      this.destinationPath('app/scripts/modules/'+this.camelizeModuleName+'/services/'+this.camelizeModuleName+'.service.js'),
      {moduleName: this.camelizeModuleName}
    );
  },
  createTemplateFile: function(){
    this.fs.copyTpl(
      this.templatePath('_template.html'),
      this.destinationPath('app/scripts/modules/'+this.camelizeModuleName+'/templates/'+this.camelizeModuleName+'.template.html'),
      {moduleName: this.camelizeModuleName}
    );
  }
});
