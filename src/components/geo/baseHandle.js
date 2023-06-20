import * as THREE from 'three';

export class BaseHandle extends THREE.Object3D {
    constructor() {
        super();
        
        this.base = new THREE.Vector3();
        this.end = new THREE.Vector3(0, 0, 1);

        this.axes = new THREE.AxesHelper(1);
        // this.add(this.axes);

        this._railGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
        this._railMat = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
        this._rail = new THREE.Mesh(this._railGeo, this._railMat);
        
        this._targetGeo = new THREE.SphereGeometry(0.3, 32, 32);
        this._targetMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        this._target = new THREE.Mesh(this._targetGeo, this._targetMat);
        this._target.position.set(0, 1, 0);


        this.add(this._rail);
        this.add(this._target);


    }
}