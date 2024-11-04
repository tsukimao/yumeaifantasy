import { AssetLoader } from './modules/AssetLoader';
import { GameState } from './modules/GameState';

export class YumeAiFantasy {
  constructor() {
    this.assetLoader = new AssetLoader();
    this.gameState = new GameState();
    this.isInitialized = false;
    this.requiredAssets = [
      'title.gif',
      'background.png',
      'matsuri.png',
      'boss.png'
    ];
  }

  async init() {
    try {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.display = 'flex';
      }

      await this.assetLoader.preloadAll(this.requiredAssets);
      this.setupEventListeners();
      this.isInitialized = true;
      this.showTitleScreen();
    } catch (error) {
      console.warn('Initialization completed with fallback assets:', error);
      this.isInitialized = true;
      this.showTitleScreen();
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('command-button')) {
        const command = e.target.dataset.command;
        this.handleCommand(command);
      }
    });

    window.addEventListener('error', (e) => {
      console.warn('Runtime error handled:', e);
      // Continue execution with fallback assets
    });
  }

  showTitleScreen() {
    if (!this.isInitialized) return;

    this.gameState.currentScene = 'title';
    const gameScreen = document.getElementById('game-screen');
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    if (gameScreen) {
      gameScreen.style.display = 'block';
      
      const titleImage = this.assetLoader.getAsset('title.gif');
      if (titleImage) {
        const backgroundLayer = document.getElementById('background-layer');
        backgroundLayer.style.backgroundImage = `url(${titleImage.src})`;
      }

      const touchToStart = document.createElement('div');
      touchToStart.id = 'touch-to-start';
      touchToStart.textContent = 'Touch to Start';
      gameScreen.appendChild(touchToStart);

      const startHandler = () => {
        if (this.gameState.currentScene === 'title') {
          touchToStart.remove();
          gameScreen.removeEventListener('click', startHandler);
          this.startStory();
        }
      };

      gameScreen.addEventListener('click', startHandler);
    }
  }

  startStory() {
    this.gameState.currentScene = 'story';
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
      const backgroundImage = this.assetLoader.getAsset('background.png');
      const backgroundLayer = document.getElementById('background-layer');
      backgroundLayer.style.backgroundImage = `url(${backgroundImage.src})`;
      
      // Continue with story initialization
      this.initializeStoryScene();
    }
  }

  initializeStoryScene() {
    const characterLayer = document.getElementById('character-layer');
    if (characterLayer) {
      const matsuriImage = this.assetLoader.getAsset('matsuri.png');
      const bossImage = this.assetLoader.getAsset('boss.png');
      
      // Set up character positions
      const matsuri = document.createElement('div');
      matsuri.className = 'character matsuri';
      matsuri.style.backgroundImage = `url(${matsuriImage.src})`;
      
      const boss = document.createElement('div');
      boss.className = 'character boss';
      boss.style.backgroundImage = `url(${bossImage.src})`;
      
      characterLayer.appendChild(matsuri);
      characterLayer.appendChild(boss);
    }
  }

  handleCommand(command) {
    if (!this.isInitialized) return;

    switch (command) {
      case 'attack':
        this.handleAttack();
        break;
      case 'magic':
        this.handleMagic();
        break;
      case 'talk':
        this.handleTalk();
        break;
      case 'escape':
        this.handleEscape();
        break;
    }
  }

  handleAttack() {
    // Attack implementation
  }

  handleMagic() {
    // Magic implementation
  }

  handleTalk() {
    // Talk implementation
  }

  handleEscape() {
    // Escape implementation
  }
}