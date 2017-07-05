import { Tile } from './tile.module';

export class Target extends Tile {
  isPassable: boolean = true;
  isEditable: boolean = false;

  constructor(x: number, y: number, size: number) {
    super(x, y, size);
  }

  get fillStyle(): string { return '#0f0'; }
}
