import { Tile } from './tile.module';
import { TargetTile } from './target-tile.module';
import { IOInstance } from './io.module';

import { randomNumber } from '../utils/random-number';

export class World {
  private io = IOInstance;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tiles: Tile[][] = [];
  private hoveredTile: Tile;
  private tileSize = 30;
  private horizontalSize = 20;
  private verticalSize = 20;

  constructor() {
    this.canvas = document.querySelector('.js-world-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    this.bindEvents();
    this.configureCanvas();
    this.generateTiles();
    this.placeTargetTile();
  }

  public update(): void {
    this.render();
  }

  public getTileForPixelCoordinate(x: number, y: number): Tile {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return this.tiles[tileX][tileY];
  }

  private bindEvents() {
    this.io.on('click', this.canvas, this.onCanvasClick.bind(this));
    this.io.on('mousemove', this.canvas, this.onCanvasMouseMove.bind(this));
    this.io.on('mouseleave', this.canvas, this.onCanvasMouseLeave.bind(this));
  }

  private onCanvasClick(event: MouseEvent) {
    const tile = this.getTileForPixelCoordinate(event.clientX, event.clientY);

    if (tile.isEditable && typeof tile.isPassable !== 'undefined') {
      tile.isPassable = !tile.isPassable;
    }
  }

  private onCanvasMouseMove(event: MouseEvent) {
    const tile = this.getTileForPixelCoordinate(event.clientX, event.clientY);

    if (this.hoveredTile !== tile) {
      this.hoveredTile = tile;
    }
  }

  private onCanvasMouseLeave(event: MouseEvent) {
    this.hoveredTile = undefined;
  }

  private configureCanvas() {
    this.canvas.width = this.tileSize * this.horizontalSize;
    this.canvas.height = this.tileSize * this.verticalSize;
    this.canvas.style.backgroundColor = '#eee';
  }

  private generateTiles() {
    for (let h = 0; h < this.horizontalSize; ++h) {
      this.tiles[h] = [];

      for (let v = 0; v < this.verticalSize; ++v) {
        this.tiles[h].push(new Tile(h, v));
      }
    }
  }

  private placeTargetTile() {
    const randomX = randomNumber(0, this.horizontalSize);
    const randomY = randomNumber(0, this.verticalSize);

    this.tiles[randomX][randomY] = new TargetTile(randomX, randomY);
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.tiles.forEach((tr => tr.forEach(t => this.renderTile(t))));

    if (this.hoveredTile) {
      this.ctx.strokeStyle = '#f00';
      this.ctx.lineWidth = 1;

      this.ctx.strokeRect(this.hoveredTile.x * this.tileSize, this.hoveredTile.y * this.tileSize, this.tileSize, this.tileSize);
    }
  }

  private renderTile(tile: Tile) {
    this.ctx.fillStyle = tile.fillStyle;
    this.ctx.strokeStyle = tile.strokeStyle;
    this.ctx.lineWidth = 1;

    this.ctx.fillRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
    this.ctx.strokeRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
  }
}

export const WorldInstance = new World();
