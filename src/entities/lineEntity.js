import { BaseEntity } from './baseEntity/baseEntity';
import { Line,
	Shape,
	BufferGeometry,
	ShapeGeometry,
	MeshBasicMaterial,
	Vector3, 
	Mesh,
	Group } from 'three';
import { BufferAttribute } from 'three';
import * as createArcoFromPolyline from 'dxf/lib/util/createArcForLWPolyline';

/**
 * @class LineEntity
 * @see {@link baseEntity/BaseEntity.md}
 * @classdesc DXF line, polyline & lwpolyline entity class.
 */
export class LineEntity extends BaseEntity {
	constructor( data ) { super( data ); }

	/**
	 * It filters all the line, polyline and lwpolylin entities and draw them.
	 * @param data {DXFData} dxf parsed data.
     * @return {THREE.Group} ThreeJS object with all the generated geometry. DXF entity is added into userData
	*/
	draw( data ) {
        
		let group = new Group();
		group.name = 'LINES';
		
		//get all lines
		let entities = data.entities.filter( entity => entity.type === 'LINE' || entity.type === 'POLYLINE' || entity.type === 'LWPOLYLINE' );
		if( entities.length === 0 ) return null;

		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if( this._hideEntity( entity ) ) continue;
            
			let cached = this._getCached( entity );
			let geometry = null;
			let material = null;
			if( cached ) { 
				geometry = cached.geometry;
				material = cached.material;
			} else {
				let _drawData = entity.type === 'LINE' ? this.drawLine( entity ) : this.drawPolyLine( entity );
				geometry = _drawData.geometry;
				material = _drawData.material;
                
				this._setCache( entity, _drawData );
			}

			let mesh;
			if (entity.layer == "item_chair" || entity.layer == "item_desk") {
				const positionAttribute = geometry.getAttribute("position");
				const shape = new Shape();
				for (let i = 0; i < positionAttribute.count; i++) {
				const x = positionAttribute.getX(i);
				const y = positionAttribute.getY(i);

				if (i === 0) {
					shape.moveTo(x, y);
				} else {
					shape.lineTo(x, y);
				}
				}
				// 将形状闭合
				shape.closePath();
				const shapeGeometry = new ShapeGeometry(shape);
				shapeGeometry.userData = { entity: entity };
				const meshMaterial = new MeshBasicMaterial({ visible: true });
				mesh = new Mesh(shapeGeometry, meshMaterial);
			} else {
				//create mesh
				let line = new Line(geometry, material);
				if (material.type === "LineDashedMaterial") this._geometryHelper.fixMeshToDrawDashedLines(line);
				line.userData = { entity: entity };
				const meshMaterial = new MeshBasicMaterial({ visible: false });
				mesh = new Mesh(geometry, meshMaterial);
				mesh.add(line);
			}
			//add to group
			group.add(mesh);
		}

		return group;
	}

	/**
	 * Draws a line entity.
	 * @param entity {entity} dxf parsed line entity.
     * @return {Object} object composed as {geometry: THREE.Geometry, material: THREE.Material}
	*/
	drawLine( entity, extrusionZ = 1 ) {
        
		let lineType = 'line';
        
		if ( entity.lineTypeName ) {
			let ltype = this.data.tables.ltypes[entity.lineTypeName];
			if( ltype && ltype.pattern.length > 0 ) lineType = 'dashed';
		}

		let material = this._colorHelper.getMaterial( entity, lineType, this.data.tables );

		let geometry = new BufferGeometry().setFromPoints( [
			new Vector3( extrusionZ * entity.start.x, entity.start.y, entity.start.z ),
			new Vector3( extrusionZ * entity.end.x, entity.end.y, entity.end.z ),
		] );
		geometry.setIndex( new BufferAttribute( new Uint16Array( [ 0, 1 ] ), 1 ) );
    

		return { geometry: geometry, material: material };
	}

	/**
	 * Draws a polyline or lwpolyline entity.
	 * @param entity {entity} dxf parsed polyline or lwpolyline entity.
     * @return {Object} object composed as {geometry: THREE.Geometry, material: THREE.Material}
	*/
	drawPolyLine( entity ) {
        
		let lineType = 'line';
        
		if ( entity.lineTypeName ) {
			let ltype = this.data.tables.ltypes[entity.lineTypeName];
			if( ltype && ltype.pattern.length > 0 ) lineType = 'dashed';
		}

		let material = this._colorHelper.getMaterial( entity, lineType, this.data.tables );

		let points = this._getPolyLinePoints( entity.vertices, entity.closed );
		let geometry = new BufferGeometry().setFromPoints( points );
		geometry.setIndex( new BufferAttribute( new Uint16Array( this._geometryHelper.generatePointIndex( points ) ), 1 ) );

		return { geometry: geometry, material: material };
	}

	_getPolyLinePoints( vertices, closed, extrusionZ = 1 ) {
		let _vertices = vertices;
		if( closed ) {
			_vertices.push( _vertices[0] );
		}
		let points = [];
		for ( let i = 0, il = _vertices.length; i < il - 1; ++i ) {

			let fromv = _vertices[i];
			let tov = _vertices[i + 1];
			let bulge = fromv.bulge;
			let from = new Vector3( fromv.x, fromv.y, fromv.z );
			let to = new Vector3( tov.x, tov.y, tov.z );

			points.push( from );
			if ( bulge ) {
				let arcPoints = createArcoFromPolyline.default( [ from.x, from.y, from.z ], [ to.x, to.y, to.z ], bulge );
				for ( let j = 0, jl = arcPoints.length; j < jl; ++j ) {
					const arc = arcPoints[j];
					points.push( new Vector3( extrusionZ * arc[0], arc[1], arc.length > 2 ? arc[2] : 0 ) );
				}
			}
    
			if ( i === il - 2 ) {
				points.push( to );
			}
		}

		return points;
	}

}