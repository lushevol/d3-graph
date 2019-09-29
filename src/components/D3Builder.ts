/*
 * @Description: 主函数
 * @Author: lushevol
 * @Date: 2019-07-20 21:08:12
 * @LastEditors: lushevol
 * @LastEditTime: 2019-09-29 18:27:36
 */
import { d3, event, Icons, Colors } from './plugins.js';

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
  public options: any;
  public VERSION: string = '0.0.1';
  public constructor() {
    this.InitVar();
  }

  public init(selector: HTMLElement, options: any) {
    this.mergeObject(this.options, options);
    this.selector = selector;
    this.container = this.d3.select(this.selector);
    this.appendGraph(this.container);
    this.simulation = this.initSimulation();
  }

  /**
   * mergeObject 合并对象
   */
  public mergeObject(target: any, source: any) {
    Object.keys(source).forEach((property: string) => {
      target[property] = source[property];
    });
  }

  public appendGraph(container: any) {
    this.svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'D3TopoGraph-graph')
      .style('background-color', 'beige')
      .call(this.d3.zoom().on('zoom', () => this.zoomed.apply(this)))
      // .on('dblclick.zoom', null) // 取消双击放大
      // .on('click', (d) => {
      //   if (typeof this.options.onGraphClick === 'function') {
      //     this.options.onGraphClick(d)
      //   }
      // })
      .append('g')
      .attr('width', '100%')
      .attr('height', '100%');

    this.svgRelationships = this.svg.append('g')
      .attr('class', 'relationships');

    this.svgNodes = this.svg.append('g')
      .attr('class', 'nodes');

    // 过滤的文字背景
    // const defs = this.svg.append('defs')
    //   .append('filter')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 1)
    //   .attr('height', 1)
    //   .attr('id', 'solid')

    // defs.append('feFlood')
    //   .attr('flood-color', '#000000')

    // defs.append('feComposite')
    //   .attr('in', 'SourceGraphic')
    //   .attr('operator', 'xor')
  }

  /**
   * @description:
   * @param {type}
   * @return:
   */
  public unitaryNormalVector(source: any, target: any, newLength: any = 1) {
    const center = { x: 0, y: 0 };
    const vector = this.unitaryVector(source, target, newLength);

    return this.rotatePoint(center, vector, 90);
  }

  public unitaryVector(source: any, target: any, newLength: any = 1) {
    // 斜边长度
    const length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);

    if (length) {
      return {
        x: (target.x - source.x) / length, // cos
        y: (target.y - source.y) / length, // sin
      };
    } else {
      return { x: 0, y: 0 };
    }
  }

  public rotate(cx: any, cy: any, x: any, y: any, angle: any) {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians); // 邻边/斜边 比例
    const sin = Math.sin(radians); // 对边/斜边 比例
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return { x: nx, y: ny };
  }

  public rotatePoint(c: any, p: any, angle: any) {
    return this.rotate(c.x, c.y, p.x, p.y, angle);
  }

  public tick() {
    this.tickNodes();
    this.tickRelationships();
  }

  public tickNodes() {
    if (this.node) {
      this.node.attr('transform', (d: any) => {
        return 'translate(' + d.x + ', ' + d.y + ')';
      });
    }
  }

  // 根据起点和终点的坐标，生成角度(如60°)
  public rotation(source: any, target: any) {
    return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
  }

  // 每帧连线动画函数绑定
  public tickRelationships() {
    if (this.relationship) {
      this.relationship.attr('transform', (d: any) => {
        const angle = this.rotation(d.source, d.target);
        return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
      });

      this.tickRelationshipsTexts();
      this.tickRelationshipsOutlines();
      this.tickRelationshipsOverlays();
    }
  }

  // 每帧连线实线部分动画函数绑定
  public tickRelationshipsOutlines() {
    const self = this;
    this.relationship.each(function() {
      const rel = self.d3.select(); // const rel = self.d3.select(this);
      const outline = rel.select('.outline');
      const text = rel.select('.text');
      // const bbox = text.node().getBBox()
      // const padding = 3

      outline.attr('d', (d: any) => {
        const center = { x: 0, y: 0 };
        const angle = self.rotation(d.source, d.target);
        const textBoundingBox = text.node().getBBox();
        const textPadding = 5;
        const u = self.unitaryVector(d.source, d.target);
        const textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 };
        const n = self.unitaryNormalVector(d.source, d.target);
        //                                  C2
        //                                  |  \
        //   A1-----B1           A2---------B2  \
        //          |    TEXT                    D2
        //   D1-----C1           G2---------F2  /
        //                                  |  /
        //                                  E2
        const rotatedPointA1 = self.rotatePoint(center, { x: 0 + (self.options.nodeRadius + 1) * u.x - n.x, y: 0 + (self.options.nodeRadius + 1) * u.y - n.y }, angle);
        const rotatedPointB1 = self.rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle);
        const rotatedPointC1 = self.rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle);
        const rotatedPointD1 = self.rotatePoint(center, { x: 0 + (self.options.nodeRadius + 1) * u.x, y: 0 + (self.options.nodeRadius + 1) * u.y }, angle);

        const rotatedPointA2 = self.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle);
        const rotatedPointB2 = self.rotatePoint(center, { x: d.target.x - d.source.x - (self.options.nodeRadius + 1) * u.x - n.x - u.x * self.options.arrowSize, y: d.target.y - d.source.y - (self.options.nodeRadius + 1) * u.y - n.y - u.y * self.options.arrowSize }, angle);
        const rotatedPointC2 = self.rotatePoint(center, { x: d.target.x - d.source.x - (self.options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * self.options.arrowSize, y: d.target.y - d.source.y - (self.options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * self.options.arrowSize }, angle);
        const rotatedPointD2 = self.rotatePoint(center, { x: d.target.x - d.source.x - (self.options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (self.options.nodeRadius + 1) * u.y }, angle);
        const rotatedPointE2 = self.rotatePoint(center, { x: d.target.x - d.source.x - (self.options.nodeRadius + 1) * u.x + (-n.x - u.x) * self.options.arrowSize, y: d.target.y - d.source.y - (self.options.nodeRadius + 1) * u.y + (-n.y - u.y) * self.options.arrowSize }, angle);
        const rotatedPointF2 = self.rotatePoint(center, { x: d.target.x - d.source.x - (self.options.nodeRadius + 1) * u.x - u.x * self.options.arrowSize, y: d.target.y - d.source.y - (self.options.nodeRadius + 1) * u.y - u.y * self.options.arrowSize }, angle);
        const rotatedPointG2 = self.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);

        return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
          // ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
          // ' L ' + rotatedPointC1.x + ' ' + rotatedPointC1.y +
          // ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
          ' L ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
          ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
          ' L ' + rotatedPointC2.x + ' ' + rotatedPointC2.y +
          ' L ' + rotatedPointD2.x + ' ' + rotatedPointD2.y +
          ' L ' + rotatedPointE2.x + ' ' + rotatedPointE2.y +
          ' L ' + rotatedPointF2.x + ' ' + rotatedPointF2.y +
          ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
          // ' L ' + rotatedPointG2.x + ' ' + rotatedPointG2.y +
          ' Z';
      });
    });
  }

  // // 每帧连线高亮部分动画函数绑定
  public tickRelationshipsOverlays() {
    this.relationshipOverlay.attr('d', (d: any) => {
      const center = { x: 0, y: 0 };
      const angle = this.rotation(d.source, d.target);
      const n1 = this.unitaryNormalVector(d.source, d.target);
      const n = this.unitaryNormalVector(d.source, d.target, 50);
      const rotatedPointA = this.rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle);
      const rotatedPointB = this.rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle);
      const rotatedPointC = this.rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle);
      const rotatedPointD = this.rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

      return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
        ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
        ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
        ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
        ' Z';
    });
  }

  // // 每帧连线文字部分动画函数绑定
  public tickRelationshipsTexts() {
    this.relationshipText.attr('transform', (d: any) => {
      const angle = (this.rotation(d.source, d.target) + 360) % 360;
      const mirror = angle > 90 && angle < 270;
      const center = { x: 0, y: 0 };
      const n = this.unitaryNormalVector(d.source, d.target);
      const nWeight = mirror ? 2 : -3;
      const point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight };
      const rotatedPoint = this.rotatePoint(center, point, angle);

      return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
    });
  }


  // 初始化力场模拟器
  public initSimulation() {
    const simulation = this.d3.forceSimulation()
      //   .velocityDecay(0.8)
      //   .force('x', d3.force().strength(0.002))
      //   .force('y', d3.force().strength(0.002))
      .force('collide', this.d3.forceCollide().radius((d: any) => {
        return this.options.minCollision;
      })
        .iterations(2))
      .force('charge', this.d3.forceManyBody())
      .force('link', this.d3.forceLink().id((d: any) => {
        return d.id;
      }))
      .force('center', this.d3.forceCenter(this.svg.node().parentElement.parentElement.clientWidth / 2, this.svg.node().parentElement.parentElement.clientHeight / 2))
      .on('tick', () => {
        this.tick();
      })
      .on('end', () => {
        if (this.options.zoomFit && !this.justLoaded) {
          this.justLoaded = true;
          this.zoomFit();
        }
      });

    return simulation;
  }

  // zoom的处理函数
  public zoomed() {
    const scale = this.d3.getEvent().transform.k;
    const translate = [this.d3.getEvent().transform.x, this.d3.getEvent().transform.y];

    if (this.svgTranslate) {
      translate[0] += this.svgTranslate[0];
      translate[1] += this.svgTranslate[1];
    }

    if (this.svgScale) {
      // this.scale *= this.svgScale
    }

    this.svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
  }

  // 整体自适应
  public zoomFit() {
    const bounds = this.svg.node().getBBox();
    const parent = this.svg.node().parentElement.parentElement;
    const fullWidth = parent.clientWidth;
    const fullHeight = parent.clientHeight;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;

    if (width === 0 || height === 0) {
      return; // nothing to fit
    }

    this.svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
    this.svgTranslate = [fullWidth / 2 - this.svgScale * midX, fullHeight / 2 - this.svgScale * midY];

    this.svg.attr('transform', 'translate(' + this.svgTranslate[0] + ', ' + this.svgTranslate[1] + ') scale(' + this.svgScale + ')');
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
      colors: Colors,
      highlight: undefined,
      iconMap: Icons,
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
