/******************      Shape             **************/
declare class mxActor  {}
declare class mxArrow {}
declare class mxArrowConnector {}
declare class mxCloud {}
declare class mxConnector {}
declare class mxCylinder {}
declare class mxDoubleEllipse {}
declare class mxEllipse {}
declare class mxHexagon {}
declare class mxImageShape {}
declare class mxLabel {}
declare class mxLine {}
declare class mxMarker {}
declare class mxPolyline extends mxShape {
	constructor(points, stroke, strokewidth);
	constraints;
}
declare class mxRectangleShape {}
declare class mxRhombus {}

declare class mxShape {
	constructor(stencil);
	constraints;
}
declare class mxStencil {}
declare class mxStencilRegistry {}
declare class mxSwimlane {}
declare class mxText {}
declare class mxTriangle {}
/******************      Shape  end        **************/