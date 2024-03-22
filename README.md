# DXF Viewer

DXF viewer made using [dxf parser](https://github.com/skymakerolof/dxf) and [threejs](https://github.com/mrdoob/three.js/). It generates a threejs object that can be used in any scene. It also has some utility classes:
* Select
* Hover
* Snap
* Merger

### Try Online

You can try it [here](https://ieskudero.github.io/three-dxf-viewer/)

### Installation

```shell
npm install three-dxf-viewer
```

## Example

To use it just initialize the main class and launch `getFromFile` or `getFromPath` methods.

```js

import { DXFViewer } from 'three-dxf-viewer';

// Suppose we have a font in our application 
let font = 'fonts/FontAwesome_Regular.typeface.json';

// Suppose we have a file input and a loading div
var file = event.target.files[0];

// Get all the geometry generated by the viewer
let dxf = await new DXFViewer().getFromFile( file, font );

// Add the geometry to the scene
scene.addDXF( dxf );

```

More examples can be found in the example folder on github.

## Utilities

There are 4 utilities that can be used optionally with the viewer:

### Merger
By default the viewer will merge Block entities. however, it is possible to merge all entities to optimize drawing big DXF files.

```js
import { Merger, DXFViewer } from 'three-dxf-viewer';

let dxf = await new DXFViewer().getFromPath( dxfFilePath, fontPath );

const mergedObject = new Merger().merge( dxf );

scene.add( mergedObject );

```

### Selection
The select class can be used to select entities in the scene. It will highlight the selected entity. Selection can be done by clicking on the entity or pressing Ctrl and using the selection box.

```js
import { Select, DXFViewer } from 'three-dxf-viewer';

let dxf = await new DXFViewer().getFromPath( dxfFilePath, fontPath );

const select = new Select( three.renderer.domElement, three.camera, dxf );
select.subscribe( 'select', ( selects ) => console.log( 'Selected entities', selects ) );

scene.add( dxf );

```

### Hover
The hover class will highlight the hovered entity by the mouse.

```js
import { Hover, DXFViewer } from 'three-dxf-viewer';

let dxf = await new DXFViewer().getFromPath( dxfFilePath, fontPath );

const hover = new Hover( three.renderer.domElement, three.camera, dxf );
hover.subscribe( 'hover', ( hovered ) => console.log( 'Hovered entity', hovered ) );

scene.add( dxf );

```

### Snaps
Snaps classes can store all the vertices in an efficient way. This allows to get the closest vertex to a point in the scene. This is useful for example to snap to the nearest vertex when drawing lines.

```js

import { SnapsHelper } from 'three-dxf-viewer';

let dxf = await new DXFViewer().getFromPath( dxfFilePath, fontPath );

let snaps = new SnapsHelper( dxf, renderer, scene, camera, controls );

```

## Development

For a more detailed explanation, there is an example folder on how to use the viewer. Download it from github an launch it with:

```js
npm install
npm run dev
```
The application will be available on http://localhost:9009

## docker开发
```shell
docker run --network host -v /Users/handsome/Workspaces/three-dxf-viewer:/app -it node bash
apt update && apt install xdg-utils
```