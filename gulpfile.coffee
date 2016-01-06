babel = require 'gulp-babel'
g = require 'gulp'
jade = require 'gulp-jade'
livereload = require 'gulp-livereload'
sass = require 'gulp-sass'
sourcemaps = require 'gulp-sourcemaps'
webserver = require 'gulp-webserver'

path =
	src:
		css: 'src/**/*.sass'
		html: 'src/**/*.jade'
		js: 'src/**/*.js'
		lib: 'lib/**/*'
	dest:
		css: 'dest'
		html: 'dest'
		js: 'dest'
		lib: 'dest'

g.task 'clean', ->
	del 'dest'

g.task 'css', ->
	g.src path.src.css
		.pipe sourcemaps.init()
		.pipe sass( style:'minify' )
		.pipe sourcemaps.write()
		.pipe g.dest(path.dest.css)
		.pipe livereload()

g.task 'html', ->
	g.src path.src.html
		.pipe sourcemaps.init()
		.pipe jade(client:false)
		.pipe sourcemaps.write()
		.pipe g.dest(path.dest.html)
		.pipe livereload()

g.task 'js', ->
	g.src path.src.js
		.pipe sourcemaps.init()
		.pipe babel(presets:'es2015')
		.pipe sourcemaps.write()
		.pipe g.dest(path.dest.js)
		.pipe livereload()

g.task 'lib', ->
	g.src path.src.lib
		.pipe g.dest(path.dest.lib)

g.task 'watch', ['webserver'], ->
	livereload.listen()
	g.watch path.src.css, ['css']
	g.watch path.src.html, ['html']
	g.watch path.src.js, ['js']

g.task 'webserver', ['build'], ->
	g.src 'dest'
		.pipe webserver
			host: '0.0.0.0'
			port: 3000

g.task 'build', [
	'css'
	'html'
	'js'
	'lib'
]

g.task 'default', [ 'watch' ]

