# gamestats.js

## Example
![Image of Gamestats](https://i.imgur.com/nCMwblD.gif)

For a live example click [here](https://eriksom.github.io/gamestats/example/)

**Features**
- FPS counter, shows the average / min / max for the visible history
- MS milliseconds that where needed to render the last frame
- Memory usage maximum (reserved) and allocated memory for the context (*Chrome only*)
- Custom graphs

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install gamestats.js
```

## Usage

```js
var stats = new GameStats();
document.body.appendChild( stats.dom );

function animate() {

	stats.begin();
	// game update goes here

	stats.begin('physics');
	// the graph will deterministically assign a color based on the label
	physics();
	stats.end('physics')

	stats.begin('render', '#6cc644')
	// optional second color parameter
	render();
	stats.end('render')

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
```
See also this [example](https://github.com/ErikSom/gamestats/blob/main/example/index.html)

**Optional configurations**
```js
var config = {
	autoPlace:true, /* auto place in the dom */
	targetFPS: 60, /* the target max FPS */
	redrawInterval: 50, /* the interval in MS for redrawing the FPS graph */
	maximumHistory: 100, /* the length of the visual graph history in frames */
	scale: 1.0, /* the scale of the canvas */
	memoryUpdateInterval: 1000, /* the interval for measuring the memory */
	memoryMaxHistory: 60 * 10, /* the max amount of memory measures */

	// Styling props
	FONT_FAMILY: 'Arial',
	COLOR_FPS_BAR: '#34cfa2',
	COLOR_FPS_AVG: '#FFF',
	COLOR_TEXT_LABEL: '#FFF',
	COLOR_TEXT_TO_LOW: '#eee207',
	COLOR_TEXT_BAD: '#d34646',
	COLOR_TEXT_TARGET: '#d249dd',
	COLOR_BG:'#333333',
}

var stats = new GameStats(config);
```

## Inspiration
[Stats.js](https://github.com/mrdoob/stats.js) (mr doob)

[Unity Graphy](https://github.com/Tayx94/graphy) (tayx94)

## License

(MIT)

Copyright (c) 2019 Erik Sombroek

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
