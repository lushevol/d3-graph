import * as d3 from 'd3';
import { event } from 'd3-selection';

class D3Builder {
  public d3: any;
  public container: any;
  public graph: any;
  public info: any;
  public node: any;
  public nodes: any;
  public relationship: any;
  public relationshipOutline: any;
  public relationshipOverlay: any;
  public relationshipText: any;
  public relationships: any;
  public selector: any;
  public simulation: any;
  public svg: any;
  public svgNodes: any;
  public svgRelationships: any;
  public svgScale: any;
  public svgTranslate: any;

  public classes2colors: any;
  public justLoaded: any;
  public numClasses: any;
  public options = {
    arrowSize: 4,
    colors: [],
    highlight: undefined,
    iconMap: [],
    icons: undefined,
    imageMap: {},
    images: undefined,
    infoPanel: true,
    minCollision: undefined,
    d3TopoData: undefined,
    d3TopoDataUrl: undefined,
    nodeOutlineFillColor: undefined,
    nodeRadius: 25,
    relationshipColor: '#a5abb6',
    zoomFit: false,
  };
  public VERSION: string = '0.0.1';
  public constructor() {
    this.InitVar();
  }
  private InitVar() {
    this.d3 = d3;
    this.d3.getEvent = () => event;
    this.container = null;
    this.graph = null;
    this.info = null;
    this.node = null;
    this.nodes = null;
    this.relationship = null;
    this.relationshipOutline = null;
    this.relationshipOverlay = null;
    this.relationshipText = null;
    this.relationships = null;
    this.selector = null;
    this.simulation = null;
    this.svg = null;
    this.svgNodes = null;
    this.svgRelationships = null;
    this.svgScale = null;
    this.svgTranslate = null;

    this.classes2colors = {};
    this.justLoaded = false;
    this.numClasses = 0;
    this.options = {
      arrowSize: 4,
      colors: this.colors(),
      highlight: undefined,
      iconMap: this.fontAwesomeIcons(),
      icons: undefined,
      imageMap: {},
      images: undefined,
      infoPanel: true,
      minCollision: undefined,
      d3TopoData: undefined,
      d3TopoDataUrl: undefined,
      nodeOutlineFillColor: undefined,
      nodeRadius: 25,
      relationshipColor: '#a5abb6',
      zoomFit: false,
    };
    this.VERSION = '0.0.1';
  }
}