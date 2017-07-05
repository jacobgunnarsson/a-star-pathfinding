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

  public getGraph(): Tile[][] { return this.graph; }

  public getVisitedTiles(): Tile[] { return this.visited; }

  public getFrontierTiles(): Tile[] { return this.frontier; }

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
