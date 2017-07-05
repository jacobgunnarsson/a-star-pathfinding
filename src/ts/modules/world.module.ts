import { IOServiceInstance } from '../services/io.service';

import { Tile } from './tile.module';
import { Target } from './target.module';
import { Player } from './player.module';
import { BreadthFirst } from './breadth-first.module';

import { randomNumber, getArrayIndex } from '../utils';

export class World {
  private io = IOServiceInstance;
  private pathFinding;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tiles: Tile[][] = [];
  private target: Target;
  private player: Player;
  private hoveredTile: Tile;
  private hoveredGraphTile: Tile;
  private tileSize = 30;
  private horizontalSize = 20;
  private verticalSize = 20;

  constructor() {
    this.canvas = document.querySelector('.js-world-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    this.bindEvents();
    this.configureCanvas();
    this.generateTiles();
    this.placeTarget();
    this.placePlayer();
  }

  public update() {
    this.render();
  }

  public getTileForPixelCoordinate(x: number, y: number): Tile {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return getArrayIndex(this.tiles, tileX, tileY);
  }

  private bindEvents() {
    this.io.on('click', this.canvas, this.onCanvasClick.bind(this));
    this.io.on('mousemove', this.canvas, this.onCanvasMouseMove.bind(this));
    this.io.on('mouseleave', this.canvas, this.onCanvasMouseLeave.bind(this));
    this.io.on('click', document.querySelector('.js-run-breadth-first'), this.runBreadthFirst.bind(this));
    this.io.on('click', document.querySelector('.js-reset-pathfinding'), this.resetPathfinding.bind(this));
    this.io.on('click', document.querySelector('.js-reset-tiles'), this.resetTiles.bind(this));
  }

  private onCanvasClick(event: MouseEvent) {
    const tile = this.getTileForPixelCoordinate(event.layerX, event.layerY);

    if (tile.isEditable && typeof tile.isPassable !== 'undefined') {
      tile.isPassable = !tile.isPassable;

      if (this.pathFinding) { this.resetPathfinding(); }
    }
  }

  private onCanvasMouseMove(event: MouseEvent) {
    const tile = this.getTileForPixelCoordinate(event.layerX, event.layerY);

    if (this.hoveredTile !== tile) {
      this.hoveredTile = tile;

      if (this.pathFinding) {
        this.hoveredGraphTile = getArrayIndex(this.pathFinding.getGraph(), tile.x, tile.y);
      }
    }
  }

  private onCanvasMouseLeave(event: MouseEvent) {
    this.hoveredTile = undefined;
    this.hoveredGraphTile = undefined;
  }

  private runBreadthFirst() {
    this.pathFinding = new BreadthFirst(this.tiles, this.player, this.ctx);
  }

  private resetPathfinding() {
    this.pathFinding = undefined;
  }

  private resetTiles() {
    this.resetPathfinding();

    for (let h = 0; h < this.horizontalSize; ++h) {
      for (let v = 0; v < this.horizontalSize; ++v) {
        if (!(this.tiles[h][v] instanceof Player) || !(this.tiles[h][v] instanceof Target)) {
          this.tiles[h][v].isPassable = true;
        }
      }
    }
  }

  private configureCanvas() {
    this.canvas.width = this.tileSize * this.horizontalSize;
    this.canvas.height = this.tileSize * this.verticalSize;
  }

  private generateTiles() {
    for (let h = 0; h < this.horizontalSize; ++h) {
      this.tiles[h] = [];

      for (let v = 0; v < this.verticalSize; ++v) {
        this.tiles[h].push(new Tile(h, v, this.tileSize));
      }
    }
  }

  private placeTarget() {
    const randomX = randomNumber(0, this.horizontalSize);
    const randomY = randomNumber(0, this.verticalSize);

    this.target = new Target(randomX, randomY, this.tileSize);

    this.tiles[randomX][randomY] = this.target;
  }

  private placePlayer() {
    const playerX = 3;
    const playerY = 3;

    if (this.tiles[playerX][playerY] instanceof Target) {
      this.placePlayer();
      return;
    }

    this.player = new Player(playerX, playerY, this.tileSize);

    this.tiles[playerX][playerY] = this.player;
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.tiles.forEach((tr => tr.forEach(t => this.renderTile(t))));

    if (this.hoveredTile) {
      this.ctx.strokeStyle = '#f00';
      this.ctx.lineWidth = 1;

      this.ctx.strokeRect(this.hoveredTile.x * this.tileSize, this.hoveredTile.y * this.tileSize, this.tileSize, this.tileSize);
    }

    if (this.pathFinding) {
      if (this.hoveredGraphTile) {
        this.renderPathfindingForTile(this.hoveredGraphTile);
      }

      if (this.pathFinding.getFrontierTiles()) {
        this.renderPathfinderFrontierTiles();
      }

      if (this.pathFinding.getVisitedTiles()) {
        this.renderPathfinderVisitedTiles();
      }
    }
  }

  private renderTile(tile: Tile) {
    this.ctx.fillStyle = tile.fillStyle;
    this.ctx.strokeStyle = tile.strokeStyle;
    this.ctx.lineWidth = 1;

    this.ctx.fillRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
    this.ctx.strokeRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
  }

  private renderPathfinderFrontierTiles() {
    const frontierTiles = this.pathFinding.getFrontierTiles();

    frontierTiles.forEach(frontierTile => {
      this.ctx.fillStyle = '#f00';

      this.ctx.beginPath();
      this.ctx.arc(frontierTile.center.x, frontierTile.center.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private renderPathfinderVisitedTiles() {
    const visitedTiles = this.pathFinding.getVisitedTiles();

    visitedTiles.forEach(visitedTile => {
      this.ctx.fillStyle = '#ccc';

      this.ctx.beginPath();
      this.ctx.arc(visitedTile.center.x, visitedTile.center.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private renderPathfindingForTile(tile: Tile) {
    let currentTile = tile;

    while (currentTile) {
      const parentTile = currentTile.parentNode;

      if (parentTile) {
        this.ctx.beginPath();
        this.ctx.moveTo(currentTile.center.x, currentTile.center.y);
        this.ctx.lineTo(parentTile.center.x, parentTile.center.y);
        this.ctx.stroke();
      }

      currentTile = parentTile;
    }
  }
}

export const WorldInstance = new World();
