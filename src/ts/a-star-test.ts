import { World, WorldInstance } from './modules/world.module';

export class AStarTest {
  window: Window;
  document: Document;
  world: World = WorldInstance;

  gameLoop;

  constructor() {
    this.window = window;
    this.document = document;

    this.setupGameLoop();
  }

  private setupGameLoop() {
    this.gameLoop = setInterval(() => {
      this.world.update();
    });
  }
}
