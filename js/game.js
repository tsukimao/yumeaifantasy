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

        // システムの初期化
        this.assetManager = new AssetManager();
        this.effectSystem = new EffectSystem(this);
        this.soundSystem = new SoundSystem(this);
        this.battleSystem = new BattleSystem(this);
        this.storySystem = new StorySystem(this);
        this.scoreSystem = new ScoreSystem(this);
        this.saveSystem = new SaveSystem(this);
        this.debugSystem = new DebugSystem(this);

        this.init();
    }

    async init() {
        try {
            await this.preloadAssets();
            await this.soundSystem.initialize();
            this.setupEventListeners();
            this.changeScene('title');
        } catch (error) {
            console.error('初期化エラー:', error);
            this.handleError(error);
        }
    }

// game.jsの一部を修正
async preloadAssets() {
    const assets = [
        { key: 'title', file: 'YUMEAIFANTASY.title.gif' },
        { key: 'background', file: 'BG.png' },
        { key: 'matsuri', file: 'yumeaimatsuri.png' },
        { key: 'boss', file: 'boss.png' }
    ];

    const loadingText = document.querySelector('.loading-text');
    let loaded = 0;

    try {
        for (const asset of assets) {
            await this.assetManager.loadAsset(asset.key, asset.file);
            loaded++;
            loadingText.textContent = `Loading... ${Math.floor((loaded / assets.length) * 100)}%`;
        }
        // アセット読み込み完了後、タイトル画面に遷移
        this.changeScene('title');
    } catch (error) {
        console.error('Asset loading failed:', error);
        this.handleError(error);
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

    async executeAttack() {
        const damage = Math.floor(Math.random() * 20) + 40;
        await this.effectSystem.playEffect('attack');
        await this.soundSystem.playSound('attack');
        await this.dealDamage('unknown', damage);
        this.scoreSystem.calculateBattleScore(damage);
    }

    async executeMagic() {
        if (this.gameState.matsuri.mp >= 15) {
            const damage = Math.floor(Math.random() * 200) + 100;
            this.gameState.matsuri.mp -= 15;
            await this.effectSystem.playEffect('magic');
            await this.soundSystem.playSound('magic');
            await this.dealDamage('unknown', damage);
            this.scoreSystem.calculateBattleScore(damage);
            this.updateStatus();
        }
    }

    async executeDarkCommunion() {
        const damage = this.gameState.unknown.hp;
        this.gameState.darkCommunionInspired = true;
        await this.effectSystem.playDarkCommunionEffect();
        await this.soundSystem.playDarkCommunionSound();
        await this.dealDamage('unknown', damage);
        this.scoreSystem.calculateDarkCommunionBonus();
    }

    async dealDamage(target, amount) {
        const targetChar = this.gameState[target];
        targetChar.hp = Math.max(0, targetChar.hp - amount);
        await this.effectSystem.showDamageNumber(amount);
        this.updateStatus();
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
        this.saveSystem.saveScore(this.scoreSystem.getScore());
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

    // デバッグ用メソッド
    debug() {
        return {
            state: this.gameState,
            forceScene: (sceneName) => this.changeScene(sceneName),
            setHP: (target, value) => {
                this.gameState[target].hp = value;
                this.updateStatus();
            },
            setMP: (value) => {
                this.gameState.matsuri.mp = value;
                this.updateStatus();
            },
            triggerDarkCommunion: () => this.executeDarkCommunion()
        };
    }
}

// ゲームの初期化
window.addEventListener('DOMContentLoaded', () => {
    window.game = new YumeAiFantasy();
});
