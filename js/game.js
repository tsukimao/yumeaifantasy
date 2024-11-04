// game.js
class YumeAiFantasy {
    constructor() {
        this.gameState = {
            currentScene: 'loading',
            matsuri: {
                hp: 1000,
                maxHp: 1000,
                mp: 100,
                maxMp: 100
            },
            unknown: {
                hp: 2000,
                maxHp: 2000
            },
            battleCount: 0,
            darkCommunionInspired: false
        };

        this.assetManager = new AssetManager();
        this.effectSystem = new EffectSystem(this);
        this.soundSystem = new SoundSystem();
        this.battleSystem = new BattleSystem(this);
        this.storySystem = new StorySystem(this);
        this.scoreSystem = new ScoreSystem(this);
        
        this.init();
    }

    async init() {
        try {
            await this.preloadAssets();
            this.setupEventListeners();
            this.changeScene('title');
        } catch (error) {
            console.error('初期化エラー:', error);
            this.handleError(error);
        }
    }

    async preloadAssets() {
        const assets = [
            'YUMEAIFANTASY.title.gif',
            'BG.png',
            'yumeaimatsuri.png',
            'boss.png'
        ];

        for (const asset of assets) {
            await this.assetManager.loadAsset(
                asset,
                `https://tsukimao.github.io/yumeaifantasy/${asset}`
            );
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (this.gameState.currentScene === 'title') {
                this.startStory();
            }
        });

        // 戦闘コマンドのイベントリスナー
        const commandButtons = document.querySelectorAll('.command-button');
        commandButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                if (this.gameState.currentScene === 'battle') {
                    switch (index) {
                        case 0: this.battleSystem.handleAttack(); break;
                        case 1: this.battleSystem.handleMagic(); break;
                        case 2: this.battleSystem.handleTalk(); break;
                        case 3: this.battleSystem.handleEscape(); break;
                    }
                }
            });
        });
    }

    changeScene(sceneName) {
        const screens = ['loading-screen', 'title-screen', 'story-screen', 'battle-screen', 'ending-screen'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                element.classList.add('hidden');
            }
        });

        const newScreen = document.getElementById(`${sceneName}-screen`);
        if (newScreen) {
            newScreen.classList.remove('hidden');
        }

        this.gameState.currentScene = sceneName;
        this.updateUI();
    }

    startStory() {
        this.storySystem.start();
    }

    startBattle() {
        this.changeScene('battle');
        this.battleSystem.initializeBattle();
    }

    updateUI() {
        if (this.gameState.currentScene === 'battle') {
            this.updateStatus();
        }
    }

    updateStatus() {
        const hpBar = document.getElementById('hp-bar');
        const mpBar = document.getElementById('mp-bar');
        
        if (hpBar) {
            hpBar.textContent = `HP: ${this.gameState.matsuri.hp}/${this.gameState.matsuri.maxHp}`;
        }
        if (mpBar) {
            mpBar.textContent = `MP: ${this.gameState.matsuri.mp}/${this.gameState.matsuri.maxMp}`;
        }
    }

    async showEnding() {
        this.changeScene('ending');
        await this.storySystem.showEndingSequence();
    }

    gameOver() {
        this.changeScene('ending');
        document.getElementById('ending-text').textContent = 'MATSURIは吸血鬼にされました';
    }

    handleError(error) {
        console.error('ゲームエラー:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'エラーが発生しました。ページを更新してください。';
        document.body.appendChild(errorMessage);
    }
}

// ゲームの初期化
window.addEventListener('DOMContentLoaded', () => {
    window.game = new YumeAiFantasy();
});
