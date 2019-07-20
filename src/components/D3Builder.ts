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
}
