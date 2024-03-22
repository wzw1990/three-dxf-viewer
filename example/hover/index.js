import { DXFViewer } from '../../src/dxfViewer.js';
import { Boilerplate } from '../boilerplate.js';
import { Hover } from '../../src/utils/hover.js';

import './index.css';

//global variables
const font = 'fonts/FontAwesome_Regular.typeface.json';
const viewer = new DXFViewer();

//init html
let html = new Boilerplate();
html.onLoad = async ( file ) => {
	html.three.clear();

	let dxf = await viewer.getFromFile( file, font );
	if( dxf ) {
		
		const hover = new Hover( html.three.renderer.domElement, html.three.camera, dxf );
		hover.subscribe( 'hover', ( hovered ) => console.log( 'Hovered entity', hovered ) );

		html.three.scene.add( dxf );
		html.three.centerCamera();
	}
};

html.init();
  






