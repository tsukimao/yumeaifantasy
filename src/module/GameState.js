export class GameState {
  constructor() {
    this.currentScene = 'loading';
    this.storyIndex = 0;
    this.matsuri = {
      hp: 1000,
      maxHp: 1000,
      mp: 100,
      maxMp: 100
    };
    this.unknown = {
      hp: 2000,
      maxHp: 2000
    };
    this.battleCount = 0;
    this.darkCommunionInspired = false;
  }

  reset() {
    this.currentScene = 'loading';
    this.storyIndex = 0;
    this.matsuri = {
      hp: 1000,
      maxHp: 1000,
      mp: 100,
      maxMp: 100
    };
    this.unknown = {
      hp: 2000,
      maxHp: 2000
    };
    this.battleCount = 0;
    this.darkCommunionInspired = false;
  }
}