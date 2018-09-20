import {ItAsset} from '../models/it-asset';


const edgeFtColor: string = "rgb(227,205,90)";
const bgColor = "rgb(48,48,48)";
const edgeBorderColor = "rgb(255,192,0)";
const vertexBorderColor = 'white';
const vertexFtColor = 'white';
const guideColor = 'rgb(227,205,90)';

export class MxGraph {

  private graph;
  private parent;

  public registerAddCellHandler(handler: Function): void {
    this.graph.addListener(mxEvent.CELLS_ADDED, handler);
  }

   public beginUpdate(): void {
    this.graph.getModel().beginUpdate();
  }

  public endUpdate(): void {
    this.graph.getModel().endUpdate();
  }

   public insertVertex(asset: ItAsset, x : number, y:number, w: number, h: number): void {
     return this.graph.insertVertex(this.parent, null, asset, x, y, w, h);
  }

  public constructor(container: Element) {
    mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          if (terminal.shape.stencil != null) {
            return terminal.shape.stencil.constraints;
          }
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints;
        }
      }
      return null;
    };

    // Defines the default constraints for all shapes
    mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
      new mxConnectionConstraint(new mxPoint(0.5, 0), true),
      new mxConnectionConstraint(new mxPoint(0.75, 0), true),
      new mxConnectionConstraint(new mxPoint(0, 0.25), true),
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      new mxConnectionConstraint(new mxPoint(0, 0.75), true),
      new mxConnectionConstraint(new mxPoint(1, 0.25), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
      new mxConnectionConstraint(new mxPoint(1, 0.75), true),
      new mxConnectionConstraint(new mxPoint(0.25, 1), true),
      new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      new mxConnectionConstraint(new mxPoint(0.75, 1), true)
    ];
    // Edges have no connection points
    mxPolyline.prototype.constraints = null;

    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);
      // Enables guides
      mxGraphHandler.prototype.guidesEnabled = true;

      // Alt disables guides
      mxGraphHandler.prototype.useGuidesForEvent = function(me) {
        return !mxEvent.isAltDown(me.getEvent());
      };
      mxGraphHandler.prototype.rotationEnabled = true;
     
      mxConstants.GUIDE_COLOR = guideColor;
      mxConstants.OUTLINE_HIGHLIGHT_COLOR = "#F0F000";
      mxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH = 1;
      mxConstants.HIGHLIGHT_STROKEWIDTH = 2;
      mxConstants.HIGHLIGHT_COLOR = '#FF0000';
      mxConstants.CONNECT_TARGET_COLOR = 'red';
      mxConstants.EDGE_SELECTION_COLOR = 'pink';
        // Defines the guides to be 1 pixel (default)
      mxConstants.GUIDE_STROKEWIDTH = 1;

      // Enables snapping waypoints to terminals
      mxEdgeHandler.prototype.snapToTerminals = true;

      // Creates the graph inside the given container
      this.graph = new mxGraph(container);
      this.graph.setConnectable(true);

      this.graph.gridSize = 10;
      // Enables connect preview for the default edge style
      this.graph.connectionHandler.createEdgeState = function(me) {
        var edge = this.graph.createEdge(null, null, null, null, null);
        return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
      };

      // Changes the default style for edges "in-place" and assigns
      // an alternate edge style which is applied in mxGraph.flip
      // when the user double clicks on the adjustment control point
      // of the edge. The ElbowConnector edge style switches to TopToBottom
      // if the horizontal style is true.




      var style = this.graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_FILLCOLOR] = bgColor;
      style[mxConstants.STYLE_STROKECOLOR] = vertexBorderColor;
      style[mxConstants.STYLE_FONTCOLOR] = vertexFtColor;

      style = this.graph.getStylesheet().getDefaultEdgeStyle();
      //style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
      //style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;

      style[mxConstants.STYLE_STROKECOLOR] = edgeBorderColor;
      style[mxConstants.STYLE_FONTCOLOR] = edgeFtColor;
      style[mxConstants.STYLE_ENDARROW] = 'block';
      style[mxConstants.EDGE_SELECTION_COLOR] = '#FFF000',
        style[mxConstants.EDGE_SELECTION_DASHED] = false;

      //graph.alternateEdgeStyle = 'elbow=vertical';
      // Specifies the default edge style
      this.graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
      // Enables rubberband selection
      new mxRubberband(this.graph);

      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      this.parent = this.graph.getDefaultParent();

      // Adds cells to the model in a single step
      /*this.graph.getModel().beginUpdate();
      var v1;
      try {
        v1 = this.graph.insertVertex(this.parent, null, 'SAP', 20, 40, 80, 70);
        var v2 = this.graph.insertVertex(parent, null, 'Opale', 200, 140, 80, 40);
        var e1 = this.graph.insertEdge(parent, null, 'client', v1, v2, 'labelBackgroundColor=' + bgColor + ';');
        var v3 = this.graph.insertVertex(parent, null, 'Indigo', 20, 200, 80, 40);
        this.graph.insertEdge(parent, null, 'document', v1, v3, 'labelBackgroundColor=' + bgColor + ';horizontal=0;');
        this.graph.insertEdge(parent, null, 'message', v2, v3, 'labelBackgroundColor=' + bgColor + ';horizontal=1;');
      } finally {
        // Updates the display
        this.graph.getModel().endUpdate();
      }*/
      let gr = this.graph;
      // Handles cursor keys
      var nudge = function(keyCode) {
        if (!gr.isSelectionEmpty()) {
          var dx = 0;
          var dy = 0;

          if (keyCode == 37) {
            dx = -1;
          } else if (keyCode == 38) {
            dy = -1;
          } else if (keyCode == 39) {
            dx = 1;
          } else if (keyCode == 40) {
            dy = 1;
          }

          gr.moveCells(gr.getSelectionCells(), dx, dy);
        }
      };

      // Transfer initial focus to graph container for keystroke handling
      this.graph.container.focus();

      // Handles keystroke events
      var keyHandler = new mxKeyHandler(this.graph);

      // Ignores enter keystroke. Remove this line if you want the
      // enter keystroke to stop editing
      keyHandler.enter = function() {};
      keyHandler.bindKey(37, function() {
        nudge(37);
      });
      keyHandler.bindKey(38, function() {
        nudge(38);
      });
      keyHandler.bindKey(39, function() {
        nudge(39);
      });
      keyHandler.bindKey(40, function() {
        nudge(40);
      });

      // add buttons
      /*
      addButton = function (label, callback) {
          var btn = document.createElement('button');
          btn.textContent = label;
          console.log(btn.getAttribute('style'));
          btn.setAttribute('style', "background-color:" + mainBackgound + ';color:' + mainFont);
          btnContainer.appendChild(btn);
          btn.onclick = callback;
      }

      addButton("add Application", function() {
              var v = graph.insertVertex(parent, null, 'Application', 200, 140, 80, 40);
          });

      addButton("add Decoration", function() {
            
              
          })
          */

    }
  }
}
