import { Tile } from './tile.module';

export class Player extends Tile {
  isPassable: boolean = false;
  isEditable: boolean = false;

  constructor(x: number, y: number, size: number) {
    super(x, y, size);
  }

  get fillStyle(): string { return '#00f'; }
}
