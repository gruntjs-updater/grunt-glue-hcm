/*
 * grunt-glue-hcm
 * https://github.com/potatolondon/grunt-glue-hcm
 *
 * Copyright (c) 2013 Potato
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var exec = require('child_process').exec,
			CSSJSON = require('../lib/css2json');


	var initStructure = function(){
		return {
			"children" : {},
			"attributes" : {}
		};
	};

	var getImagePosition = function(backgroundPosition){
		var aux = backgroundPosition.replace(/px/g,'').split(' ');

    return {
			x : aux[0],
			y : aux[1]
		};
	};

	function clone(obj) {
		if (null === obj || "object" !== typeof obj) {
      return obj;
    }

    var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
		}
		return copy;
	}

	var createHighContrastModeCSS = function(options,done,file){
		var hcm = { children : {} },
				fileName = '_sprite.';

		if (options.less) {
			fileName += 'less';
		}
		else if (options.scss) {
			fileName += 'scss';
		}
		else {
			fileName += 'css';
		}

		var cssJson = CSSJSON.toJSON(grunt.file.read(file.css + fileName),true);
		var cssJsonKeys = Object.keys(cssJson.children);
		var firstDeclaration = cssJson.children[cssJsonKeys[0]];

		// We have to disable HCM in retina since Retina is unlikely to be available in a hcm
		if (options.retina){
			var lastDeclarationKey = cssJsonKeys[cssJsonKeys.length-1];
			var lastDeclaration = cssJson.children[lastDeclarationKey];
			var key = Object.keys(lastDeclaration.children)[0];
			var cloned = clone(lastDeclaration.children[key]);
			delete lastDeclaration.children[key];
			key += ',\n' + '.hcm:before';
			lastDeclaration.children[key] = cloned;
		}

		// Adding High Contrast Mode classes
		cssJson.children['.hcm'] = initStructure();
		cssJson.children['.hcm:before'] = initStructure();

		cssJson.children['.hcm'].attributes = {
			"display": "inline-block",
			"background-image": "none !important",
			"overflow": "hidden",
			"position": "relative"
		};

		cssJson.children['.hcm:before'].attributes = {
			"position" : "relative",
			"content" : firstDeclaration.attributes['background-image'].replace(/["']/g, "")
		};

		// Removing first and last keys
		cssJsonKeys.pop();
		cssJsonKeys.shift();

		for (var i = 0, length = cssJsonKeys.length; i < length; i++){
			var hcmKey = cssJsonKeys[i] + '.hcm:before';
			var imagePosition = getImagePosition(cssJson.children[cssJsonKeys[i]].attributes['background-position']);

			cssJson.children[hcmKey] = initStructure();
			cssJson.children[hcmKey].attributes.width = cssJson.children[cssJsonKeys[i]].attributes.width;
			cssJson.children[hcmKey].attributes.height = cssJson.children[cssJsonKeys[i]].attributes.height;
			cssJson.children[hcmKey].attributes.margin = imagePosition.y + 'px 0 0 '+ imagePosition.x +'px';
			cssJson.children[hcmKey].attributes.display = "block";
		}

		grunt.file.write(file.css + fileName, CSSJSON.toCSS(cssJson));
		done();
	};

  grunt.registerMultiTask('glue', 'A wrapper for the Glue spriting tool, offering some advanced options.', function() {
		var done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			algorithm: 'square',
			cachebuster: false,
			"cachebuster-filename" : false,
			crop: false,
			"follow-links" : false,
			force: false,
			"ignore-filename-paddings" : false,
			imagemagick: false,
			imagemagickpath: false,
			less: false,
			margin: false,
			namespace: '',
			"no-css": false,
			"no-img": false,
			optipng: true,
			optipngpath: '',
			ordering: 'maxside',
			padding: false,
			png8: false,
			project: false,
			quiet: true,
			ratios: false,
			recursive: true,
			retina: true,
			scss: false,
			separator: '-',
			"sprite-namespace" : '',
			url: false,
			"high-contrast-mode" : false
		});

		var baseCommand = ' ';

		for (var option in options){
			if (options[option] !== false && option !== "high-contrast-mode"){
				if (grunt.util.kindOf(options[option]) === "boolean"){ // true
					baseCommand += ' --' + option;
				}
				else {
					baseCommand += ' --' + option + '="'+options[option]+'"';
				}
			}
		}

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
			var src = file.src.filter(function(filepath){
				var exists = true;

				if (!grunt.file.exists(filepath)){
					grunt.log.warn('Dir "' + filepath + '" not found.');
					exists = false;
				}

				return exists;
			});

			src.forEach(function(dir){
				var fullCommand = 'glue ' + dir + baseCommand + ' --css=' + file.css + ' --img=' + file.img;

				exec(fullCommand, function(err, stdout, stderr) {
					if (err) {
						grunt.fatal(err);
					}
					if (stderr && stderr.indexOf('/bin/sh:') === -1) {
						grunt.fatal(stderr);
					}
					if (options['high-contrast-mode']){
						createHighContrastModeCSS(options,done,file);
					}
					else {
						done();
					}
				});
			});
    });
  });
};