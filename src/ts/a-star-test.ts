import { WorldInstance } from './modules/world.module';

export class AStarTest {
  private window: Window;
  private document: Document;
  private world = WorldInstance;

  private gameLoop;

  constructor() {
    this.window = window;
    this.document = document;

    this.gameLoop = setInterval(this.onGameloopTick.bind(this), 16.667);
  }

  private onGameloopTick() {
    this.world.update();
  }
}
