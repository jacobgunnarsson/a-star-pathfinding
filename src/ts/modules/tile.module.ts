export class Tile {
  x: number;
  y: number;
  size: number;

  parentNode: Tile;
  isPassable: boolean = true;
  isEditable: boolean = true;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  get fillStyle(): string { return this.isPassable ? 'transparent' : '#000'; }

  get strokeStyle(): string { return '#fff'; }

  get center(): { x: number, y: number } {
    return {
      x: (this.x * this.size) + (this.size / 2),
      y: (this.y * this.size) + (this.size / 2)
    };
  }
}
