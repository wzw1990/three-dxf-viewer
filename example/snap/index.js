import { DXFViewer } from '../../src/dxfViewer.js';
import { SnapsHelper } from '../../src/utils/snapsHelper.js';
import { Boilerplate } from '../boilerplate.js';

//global variables
const font = 'fonts/FontAwesome_Regular.typeface.json';
let snaps;

//init html
let html = new Boilerplate();
html.onLoad = async ( file ) => {
	html.three.clear();

	let dxf = await new DXFViewer().getFromFile( file, font );
	if( dxf ) {

		if( snaps ) snaps.clear();
		snaps = new SnapsHelper( dxf, html.three.renderer, html.three.scene, html.three.camera, html.three.controls );

		//add dxf
		html.three.addDXF( dxf );
	}
};

html.init();
  






