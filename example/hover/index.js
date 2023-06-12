import { DXFViewer } from '../../src/dxfViewer.js';
import { Boilerplate } from '../boilerplate.js';
import { Hover } from '../../src/utils/hover.js';

//global variables
const font = 'fonts/helvetiker_regular.typeface.json';
const viewer = new DXFViewer();

//init html
let html = new Boilerplate();
html.onLoad = async ( file ) => {
	html.three.clear();

	let dxf = await viewer.getFromFile( file, font );
	if( dxf ) {
		
		new Hover( html.three.renderer.domElement, html.three.camera, dxf );

		html.three.scene.add( dxf );
		html.three.centerCamera();
	}
};

html.init();
  






