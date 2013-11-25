# grunt-contrast-glue

> A wrapper for the Glue spriting tool, offering some advanced options.

This plugin is initially based on [grunt-glue](https://bitbucket.org/carkraus/grunt-glue) which was being used for some of our projects. However, we needed to add some features to cover High Contrast Mode
for accesibility purposes.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-glue-hcm --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-glue-hcm');
```

## The "glue" task

### Overview
In your project's Gruntfile, add a section named `glue` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  glue: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

All options are from the original [Glue documentation](http://glue.readthedocs.org/en/latest/options.html). However, there are some new options:

#### `high-contrast-mode`

This is the reason this task was born! When you enable High Contrast Mode in Windows, you can't see any background images because they're turned off. That's cool sometimes but it's definitelly not
when you are using a sprite for all the things. A button should be visible after all, right?

This mode will overwrite your output CSS from something like this:

````css
.sprite-play {
	background-position: -190px -175px;
	width: 95px;
	height: 95px;
}
````

To something like this:

````css
.hcm {
	display: inline-block;
	background-image: none !important;
	overflow: hidden;
	position: relative;
}
.hcm:before {
	position: relative;
	content: url('../img/_sprite.png');
}
.sprite-play {
	background-position: -190px -175px;
	width: 95px;
	height: 95px;
}
.sprite-play.hcm:before {
	width: 95px;
	height: 95px;
	margin: -175px 0 0 -190px;
	display: block;
}
````

So now it's up to you for the image to be high contrast mode compatible or not. You have to manually add the class `.hcm` to the element you want to be compatible in order to trigger
this new behaviour.

> If you are thinking, what is this High Contrast Mode thing? And why all this hassle? You should probably check this [article on Yahoo](http://yaccessibilityblog.com/library/tag/sprite) which explains the issue,
and the solution, really clearly.

#### A note of warning

Please, be aware that the Grunt task won't check if the parameters are correct. For example, if you provide a wrong `padding` setting, it's likely that Glue will complain (and the task as well)
but the task doesn't perform any checks on that.

Also, you should know that every parameter which is not equal to `false`, will be passed as a parameter to Glue.

This is an example of how the task should look like:

````
glue: {
    dev: {
        files : [{
          src : 'test/img/sprite/',
          img : 'test/img/',
          css : 'test/css/'
        }],
        options: {
          retina: true,
          optipng: true,
          recursive: true,
          "high-contrast-mode": true,
          "sprite-namespace": "sprite"
        }
    }
}
````

Where:

    * `src` : Is where your sprite images are located.
    * `img` : Is where the sprite(s) will be located by Glue.
    * `css` : Is where the css/less/scss file will be located by Glue.

Note that you can provide as many paths as you like to the files array.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## ToDo

    * Testing! Testing is pending on this package.