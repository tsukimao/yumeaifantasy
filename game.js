// グローバル変数
const game = {
    gameState: {
        currentScene: 'loading',
        storyIndex: 0,
        matsuri: {
            hp: 1000,
            mp: 100,
        },
        unknown: {
            hp: 2000,
        },
        battleCount: 0,
        darkCommunionInspired: false,
        isFinalPhase: false,
        isEffectPlaying: false
    },
    storySequence: [
        "MATSURIは男を追い詰めた",
        "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
        "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
        "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
        "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
        "MATSURIは危険を感じた。この男は一体。",
        "戦闘を開始します。"
    ],
    unknownBattleDialogues: [
        "UNKNOWN: 『力を見せてみせる』",
        "UNKNOWN: 『これが吸血鬼の力だ』",
        "UNKNOWN: 『お前の血を吸わせてもらう』",
        "UNKNOWN: 『永遠の命が欲しいか？』"
    ],
    debug() {
        return {
            state: this.gameState,
            checkInitialization: () => {
                console.log('Game State:', this.gameState);
                console.log('Is Initialized:', this.isInitialized);
                return this.isInitialized;
            },
            forcePhase: (phase) => {
                this.gameState.isFinalPhase = phase === 'final';
                this.updateStatus();
            },
            triggerDarkCommunion: () => {
                this.gameState.darkCommunionInspired = true;
                this.updateStatus();
            },
            testEffect: (effectType) => {
                this.playEffect(effectType.toUpperCase());
            }
        };
    },
    async preloadAssets() {
        const assets = ['YUMEAIFANTASY.title.gif', 'BG.png', 'yumeaimatsuri.png', 'boss.png', 'magic-circle.png'];
        try {
            const promises = assets.map(asset => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = () => reject(`Failed to load: ${asset}`);
                    img.src = `assets/${asset}`;
                });
            });
            await Promise.all(promises);
            console.log('Assets loaded successfully');
        } catch (error) {
            console.error('Asset loading failed:', error);
            throw new Error(`Asset loading failed: ${error.message}`);
        }
    },
    startGame() {
        this.transitionTo('title');
    },
    transitionTo(scene) {
        document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
        document.getElementById(`${scene}-screen`).style.display = 'block';
        this.gameState.currentScene = scene;
        if (scene === 'story') {
            this.showStoryText();
        } else if (scene === 'battle') {
            this.startBattle();
        }
    },
    startStory() {
        this.transitionTo('story');
        this.showStoryText();
    },
    showStoryText() {
        const storyTextElement = document.getElementById('story-text');
        if (this.gameState.storyIndex < this.storySequence.length) {
            storyTextElement.innerHTML = this.storySequence[this.gameState.storyIndex];
            this.gameState.storyIndex++;
            setTimeout(() => this.showStoryText(), 3500); // 3.5秒後に次のテキストを表示
        } else {
            this.startBattle();
        }
    },
    startBattle() {
        this.transitionTo('battle');
        this.updateStatus();
        this.showBattleMessage("戦闘開始！");
        this.displayCommandButtons();
        this.gameState.battleCount = 0;
    },
    updateStatus() {
        document.getElementById('hp-bar').querySelector('span').textContent = `HP: ${this.gameState.matsuri.hp}/1000`;
        document.getElementById('mp-bar').querySelector('span').textContent = `MP: ${this.gameState.matsuri.mp}/100`;
    },
    showBattleMessage(message) {
        document.getElementById('message-text').textContent = message;
    },
    displayCommandButtons() {
        const commands = ['たたかう', 'まほう', 'はなす', 'にげる'];
        commands.forEach((command, index) => {
            const button = document.querySelectorAll('.command-button')[index];
            button.textContent = command;
            button.onclick = () => this.handleCommand(command);
        });
    },
    handleCommand(command) {
        this.gameState.battleCount++;
        if (this.gameState.battleCount >= 30) {
            this.gameOver();
            return;
        }
        switch (command) {
            case 'たたかう':
                this.handleAttack();
                break;
            case 'まほう':
                this.handleMagic();
                break;
            case 'はなす':
                this.handleTalk();
                break;
            case 'にげる':
                this.gameOver();
                break;
        }
    },
    handleAttack() {
        const damage = Math.floor(Math.random() * 20) + 40;
        this.gameState.unknown.hp -= damage;
        this.showBattleMessage(`MATSURIの攻撃！${damage}のダメージを与えた！`);
        this.playEffect('FLASH');
        this.checkEnemyStatus();
    },
    handleMagic() {
        if (this.gameState.matsuri.mp >= 15) {
            this.gameState.matsuri.mp -= 15;
            const damage = Math.floor(Math.random() * 200) + 100;
            this.gameState.unknown.hp -= damage;
            this.showBattleMessage(`MATSURIの魔法！${damage}のダメージを与えた！`);
            this.playEffect('MAGIC');
            this.checkEnemyStatus();
        } else {
            this.showBattleMessage("MPが足りません！");
        }
    },
    handleTalk() {
        const dialogue = this.unknownBattleDialogues[Math.floor(Math.random() * this.unknownBattleDialogues.length)];
        this.showBattleMessage(dialogue);
        if (this.gameState.unknown.hp <= 1000 && Math.random() < 0.3) {
            this.gameState.darkCommunionInspired = true;
            this.showBattleMessage("黒の聖餐が解放されました！");
            this.playEffect('DARK_COMMUNION');
        }
    },
    checkEnemyStatus() {
        if (this.gameState.unknown.hp <= 0) {
            this.triggerEnding();
        }
    },
    gameOver() {
        this.transitionTo('game-over');
    },
    triggerEnding() {
        this.transitionTo('ending');
        this.showEndingSequence();
    },
    showEndingSequence() {
        const endingTextElement = document.getElementById('ending-text');
        const endingTexts = [
            "永き夜の終わりに、一筋の光が差し込む。",
            "幾百年もの間、永遠の命という呪いに縛られ続けた魂が、今、解放の時を迎えようとしていた。",
            "黒の聖餐――それは、人の世の理から外れた存在を、本来あるべき姿へと導く禁忌の魔法。",
            // ...（他のエンディングテキスト）
        ];
        let index = 0;
        const showNextText = () => {
            if (index < endingTexts.length) {
                endingTextElement.textContent = endingTexts[index];
                index++;
                setTimeout(showNextText, 4000);
            }
        };
        showNextText();
        document.getElementById('retry-button').addEventListener('click', () => location.reload());
        document.getElementById('official-site-button').addEventListener('click', () => window.open('https://reverieneon71.my.canva.site/', '_blank'));
    },
    playEffect(effect) {
        if (!this.gameState.isEffectPlaying) {
            this.gameState.isEffectPlaying = true;
            switch (effect) {
                case 'FLASH':
                    this.flashEffect();
                    break;
                case 'MAGIC':
                    this.magicEffect();
                    break;
                case 'DARK_COMMUNION':
                    this.darkCommunionEffect();
                    break;
            }
            setTimeout(() => this.gameState.isEffectPlaying = false, 500); // エフェクト再生後0.5秒でリセット
        }
    },
    flashEffect() {
        const flashElement = document.createElement('div');
        flashElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: 0.7; z-index: 9998;';
        document.getElementById('battle-screen').appendChild(flashElement);
        setTimeout(() => flashElement.remove(), 200);
    },
    magicEffect() {
        const magicCircle = document.createElement('div');
        magicCircle.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: url("assets/magic-circle.png") no-repeat center; background-size: contain; z-index: 9997; opacity: 0;';
        document.getElementById('battle-screen').appendChild(magicCircle);
        setTimeout(() => {
            magicCircle.style.animation = 'magic-circle-animation 1s ease-out forwards';
            setTimeout(() => magicCircle.remove(), 1000);
        }, 0);
    },
    darkCommunionEffect() {
        const darkCommunionElement = document.createElement('div');
        darkCommunionElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, #300066, #660066); opacity: 0.8; z-index: 9999;';
        document.getElementById('battle-screen').appendChild(darkCommunionElement);
        setTimeout(() => darkCommunionElement.remove(), 1500);
    },
    async preloadAssets() {
        const assets = ['YUMEAIFANTASY.title.gif', 'BG.png', 'yumeaimatsuri.png', 'boss.png', 'magic-circle.png'];
        try {
            const promises = assets.map(asset => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = () => reject(`Failed to load: ${asset}`);
                    img.src = `assets/${asset}`;
                });
            });
            await Promise.all(promises);
            console.log('Assets loaded successfully');
        } catch (error) {
            console.error('Asset loading failed:', error);
            throw new Error(`Asset loading failed: ${error.message}`);
        }
    },
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        this.showErrorMessage('ゲームの初期化に失敗しました。');
    },
    showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            z-index: 9999;
        `;
        errorMessage.textContent = message;
        const retryButton = document.createElement('button');
        retryButton.textContent = 'リトライ';
        retryButton.style.cssText = `
            margin-top: 10px;
            padding: 5px 15px;
            background: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        retryButton.onclick = () => location.reload();
        errorMessage.appendChild(document.createElement('br'));
        errorMessage.appendChild(retryButton);
        document.body.appendChild(errorMessage);
    },
    isInitialized: false,
    async initialize() {
        try {
            await this.preloadAssets();
            this.isInitialized = true;
            console.log('Game initialized successfully');
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
};

window.onload = async () => {
    await game.initialize();
    game.startGame();
};
