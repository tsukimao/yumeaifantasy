import { gsap } from 'gsap';

class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.baseUrl = 'https://tsukimao.github.io/yumeaifantasy';
  }

  async loadImage(name) {
    if (this.assets.has(name)) {
      return this.assets.get(name);
    }

    try {
      const img = new Image();
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${name}`));
      });

      img.src = `${this.baseUrl}/${name}`;
      const loadedImg = await loadPromise;
      this.assets.set(name, loadedImg);
      return loadedImg;
    } catch (error) {
      console.error(`Error loading ${name}:`, error);
      throw error;
    }
  }

  getAsset(name) {
    return this.assets.get(name);
  }
}

class GameState {
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
}

class YumeAiFantasy {
  constructor() {
    this.assetLoader = new AssetLoader();
    this.gameState = new GameState();
    this.isInitialized = false;
    this.requiredAssets = [
      'YUMEAIFANTASY.title.gif',
      'BG.png',
      'yumeaimatsuri.png',
      'boss.png'
    ];
  }

  async init() {
    try {
      await this.preloadAssets();
      this.setupEventListeners();
      this.isInitialized = true;
      this.showTitleScreen();
    } catch (error) {
      console.error('Initialization error:', error);
      this.handleInitializationError(error);
    }
  }

  async preloadAssets() {
    try {
      const loadPromises = this.requiredAssets.map(asset => 
        this.assetLoader.loadImage(asset)
      );
      await Promise.all(loadPromises);
      return true;
    } catch (error) {
      throw new Error(`Asset loading failed: ${error.message}`);
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
      console.error('Runtime error:', e);
      this.handleRuntimeError(e);
    });
  }

  showTitleScreen() {
    if (!this.isInitialized) {
      console.error('Game not initialized');
      return;
    }

    this.gameState.currentScene = 'title';
    const gameScreen = document.getElementById('game-screen');
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
    
    if (gameScreen) {
      gameScreen.classList.remove('hidden');
      
      const backgroundLayer = document.getElementById('background-layer');
      if (backgroundLayer) {
        const titleImage = this.assetLoader.getAsset('YUMEAIFANTASY.title.gif');
        if (titleImage) {
          backgroundLayer.style.backgroundImage = `url(${titleImage.src})`;
          backgroundLayer.style.backgroundSize = 'cover';
          backgroundLayer.style.backgroundPosition = 'center';
        }
      }
      
      const touchToStart = document.createElement('div');
      touchToStart.textContent = 'Touch to Start';
      touchToStart.style.cssText = `
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-size: clamp(16px, 3vw, 24px);
        color: white;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        animation: blink 1s infinite;
      `;
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
    // Story implementation will be added in subsequent updates
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

  handleInitializationError(error) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }

    this.showErrorMessage('ゲームの初期化に失敗しました。ページを再読み込みしてください。');
  }

  handleRuntimeError(error) {
    console.error('Runtime error:', error);
    this.showErrorMessage('エラーが発生しました。ページを再読み込みしてください。');
  }

  showErrorMessage(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div class="error-content">
        <p>${message}</p>
        <button onclick="location.reload()">再読み込み</button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
}

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
  window.game = new YumeAiFantasy();
  window.game.init().catch(error => {
    console.error('Game initialization failed:', error);
  });
});