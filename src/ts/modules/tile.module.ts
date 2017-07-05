export class Tile {
  x: number;
  y: number;

  isPassable: boolean = true;
  isEditable: boolean = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get fillStyle(): string { return this.isPassable ? 'transparent' : '#000'; }

  get strokeStyle(): string { return '#fff'; }
}
