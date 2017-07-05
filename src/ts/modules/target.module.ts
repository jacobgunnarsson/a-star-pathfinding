import { Tile } from './tile.module';

export class Target extends Tile {
  isPassable: boolean = true;
  isEditable: boolean = false;

  constructor(x: number, y: number) {
    super(x, y);
  }

  get fillStyle(): string { return '#0f0'; }
}
