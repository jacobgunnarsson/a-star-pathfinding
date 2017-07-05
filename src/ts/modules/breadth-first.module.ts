import { Tile } from './tile.module';

import { getArrayIndex } from '../utils';

export class BreadthFirst {
  private graph: Tile[][] = [];
  private frontier: Tile[] = [];
  private visited: Tile[] = [];
  private ctx: CanvasRenderingContext2D;
  private frontierInterval: number;

  constructor(graph: Tile[][], startNode: Tile, ctx: CanvasRenderingContext2D) {
    this.graph = this.graph.concat(graph);
    this.frontier.push(startNode);
    this.ctx = ctx;

    this.frontierInterval = setInterval(() => {
      if (this.frontier.length > 0) {
        this.advanceFrontier();
      } else {

      }
    }, 4);
  }

  public render() {
    this.visited.forEach(v => {
      this.ctx.fillStyle = '#ccc';

      this.ctx.beginPath();
      this.ctx.arc(v.center.x, v.center.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.frontier.forEach(v => {
      this.ctx.fillStyle = '#f00';

      this.ctx.beginPath();
      this.ctx.arc(v.center.x, v.center.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  public getGraph(): Tile[][] { return this.graph; }

  private advanceFrontier() {
    const current = this.frontier.shift();
    const adjacent = this.getNeighbors(current);

    this.visited.push(current);

    adjacent.forEach(a => a.parentNode = current);

    this.frontier = this.frontier.concat(adjacent);
  }

  private getNeighbors(node: Tile): Tile[] {
    const neighbors = [];
    const potentialNeighbors = [
      getArrayIndex(this.graph, node.x, node.y - 1),
      getArrayIndex(this.graph, node.x + 1, node.y),
      getArrayIndex(this.graph, node.x, node.y + 1),
      getArrayIndex(this.graph, node.x - 1, node.y)
    ];

    potentialNeighbors.forEach(potentialNeighbor => {
      if (potentialNeighbor                              &&
          potentialNeighbor.isPassable                   &&
          this.visited.indexOf(potentialNeighbor) < 0    &&
          this.frontier.indexOf(potentialNeighbor) < 0)
      {
        neighbors.push(potentialNeighbor);
      }
    });

    return neighbors;
  }
};
