// game.js
class YumeAiFantasy {
    constructor() {
        this.initializeGame();
        this.preloadAssets();
    }

    initializeGame() {
        this.gameState = {
            matsuri: {
                hp: 1000,
                mp: 100,
                maxHp: 1000,
                maxMp: 100
            },
            unknown: {
                hp: 2000,
                maxHp: 2000
            },
            currentScene: 'loading',
            storyIndex: 0,
            isFinalPhase: false,
            isAnimating: false,
            darkCommunionUnlocked: false
        };

        this.storySequence = [
            "MATSURIは男を追い詰めた",
            "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
            "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
            "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
            "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
            "MATSURIは危険を感じた。この男は一体。",
            "戦闘を開始します。"
        ];

        this.vampireDialogues = {
            normal: [
                "永遠の命には、永遠の孤独が伴う...",
                "人の血を求めることは、呪いであり祝福でもある。",
                "月明かりは私たちの母。太陽は私たちの敵。",
                "私たちは死と生の狭間に存在する者たち..."
            ],
            wounded: [
                "何百年もの時を生きてきた。その代償として愛する者への苦しみを知る。",
                "吸血鬼は一族を形成し、かつて世界を支配していた。今は...",
                "私たちは完全な死も、完全な生も許されない存在...",
                "永遠の命は、永遠の孤独という代償を伴う..."
            ],
            desperate: [
                "この痛みですら、永遠の時の中では一瞬の煌めきに過ぎない...",
                "私は死ねない。それが最大の呪いだ。",
                "永遠の命を得た代償に、すべての愛する者を失った...",
                "人の血を求める呪いから、解放されることはないのか..."
            ]
        };

        this.darkCommunionEvent = {
            flashback: [
                "MATSURI: （そういえば、あの時師匠が言っていた...）",
                "師匠: 黒の聖餐は禁忌の魔法。",
                "師匠: 使用者の命を代償に、不死の存在に絶大な効果を与える。",
                "師匠: だが、使えば使用者の魂まで危うくなる。",
                "師匠: 決して軽々しく使ってはならない。"
            ],
            execution: [
                "MATSURIは禁忌の魔法を思い出した...",
                "黒き聖餐よ、我が魂を捧げる...",
                "全てを終わらせる時が来た。"
            ]
        };

        this.battlePhases = {
            normal: { hp: 2000, threshold: 1500 },
            wounded: { hp: 1500, threshold: 800 },
            desperate: { hp: 800, threshold: 300 },
            final: { hp: 300, threshold: 0 }
        };

        this.bindEvents();
    }

    preloadAssets() {
        const assets = [
            'BG.png',
            'YUMEAIFANTASY.title.gif',
            'boss.mahou.gif',
            'boss.png',
            'matsuri.mahou.gif',
            'yumeaimatsuri.png'
        ];

        let loadedAssets = 0;
        const totalAssets = assets.length;

        assets.forEach(asset => {
            const img = new Image();
            img.onload = () => {
                loadedAssets++;
                if (loadedAssets === totalAssets) {
                    this.hideElement('loading-screen');
                    this.showElement('title-screen');
                    this.gameState.currentScene = 'title';
                }
            };
            img.src = `https://tsukimao.github.io/yumeaifantasy/${asset}`;
        });
    }

    bindEvents() {
        document.querySelector('#title-screen').addEventListener('click', () => this.startGame());
        document.querySelector('#next-button').addEventListener('click', () => this.nextStory());
        document.querySelector('#attack').addEventListener('click', () => this.handleAttack());
        document.querySelector('#magic').addEventListener('click', () => this.handleMagic());
        document.querySelector('#talk').addEventListener('click', () => this.handleTalk());
        document.querySelector('#escape').addEventListener('click', () => this.handleEscape());
        document.querySelector('#dark-communion').addEventListener('click', () => this.handleDarkCommunion());
        document.querySelector('#retry').addEventListener('click', () => this.resetGame());

        // タッチデバイス対応
        this.addTouchEvents();
    }

    addTouchEvents() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.classList.add('touched');
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.classList.remove('touched');
            });
        });
    }
        async startGame() {
        if (this.gameState.currentScene !== 'title') return;
        this.hideElement('title-screen');
        this.showElement('story-screen');
        this.gameState.currentScene = 'story';
        await this.updateStory();
    }

    async nextStory() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.storyIndex++;
        if (this.gameState.storyIndex < this.storySequence.length) {
            await this.updateStory();
        } else {
            this.startBattle();
        }
    }

    async updateStory() {
        this.gameState.isAnimating = true;
        const storyText = document.querySelector('#story-text');
        storyText.style.opacity = '0';
        
        await this.wait(300);
        storyText.textContent = this.storySequence[this.gameState.storyIndex];
        storyText.style.opacity = '1';
        
        this.gameState.isAnimating = false;
    }

    startBattle() {
        this.hideElement('story-screen');
        this.showElement('battle-screen');
        this.gameState.currentScene = 'battle';
        this.updateStatus();
        this.showMessage("コマンドを選択してください。");
    }

    async handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        await this.showAttackAnimation('matsuri');
        this.showDamageText(damage);
        await this.applyDamage(damage);
        await this.showRandomUnknownMessage();
        
        this.gameState.isAnimating = false;
        this.checkBattleStatus();
    }

    async handleMagic() {
        if (this.gameState.isAnimating || this.gameState.matsuri.mp < 15) {
            if (this.gameState.matsuri.mp < 15) {
                this.showMessage("MPが足りません！");
            }
            return;
        }

        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 200) + 100;
        this.gameState.matsuri.mp -= 15;

        await this.showMagicAnimation('matsuri');
        this.showDamageText(damage);
        await this.applyDamage(damage);
        await this.showRandomUnknownMessage();
        
        this.gameState.isAnimating = false;
        this.checkBattleStatus();
    }

    async handleTalk() {
        if (this.gameState.isAnimating) return;
        
        if (this.gameState.isFinalPhase) {
            await this.showDarkCommunionEvent();
        } else {
            await this.showRandomUnknownMessage();
        }
    }

    handleEscape() {
        this.showBadEnding("MATSURIは吸血鬼にされました");
    }

    async handleDarkCommunion() {
        if (!this.gameState.darkCommunionUnlocked || this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        await this.executeDarkCommunion();
    }

    async executeDarkCommunion() {
        const effectLayer = document.querySelector('#dark-communion-effect');
        effectLayer.classList.remove('hidden');

        for (const text of this.darkCommunionEvent.execution) {
            await this.showMessage(text);
            await this.wait(2000);
        }

        await this.showDarkCommunionAnimation();
        await this.showTrueEnding();
    }

    async showDarkCommunionEvent() {
        this.gameState.isAnimating = true;
        this.showElement('flashback-screen');

        for (const text of this.darkCommunionEvent.flashback) {
            await this.typewriterEffect(text);
            await this.wait(2000);
        }

        this.hideElement('flashback-screen');
        this.gameState.darkCommunionUnlocked = true;
        document.querySelector('#dark-communion').classList.remove('hidden');
        
        this.gameState.isAnimating = false;
    }

    async typewriterEffect(text) {
        const textElement = document.querySelector('#flashback-text');
        textElement.textContent = '';
        
        for (const char of text) {
            textElement.textContent += char;
            await this.wait(50);
        }
    }

    async showAttackAnimation(character) {
        const container = document.querySelector(`#${character}-container`);
        container.classList.add('attack-animation');
        await this.wait(500);
        container.classList.remove('attack-animation');
    }

    async showMagicAnimation(character) {
        const effectLayer = document.querySelector('#effect-layer');
        const effect = document.createElement('img');
        effect.src = `https://tsukimao.github.io/yumeaifantasy/${character}.mahou.gif`;
        effect.className = 'magic-effect';
        
        effectLayer.appendChild(effect);
        await this.wait(1000);
        effect.remove();
    }

    async showDarkCommunionAnimation() {
        const battleScreen = document.querySelector('#battle-screen');
        battleScreen.classList.add('dark-communion');
        
        await this.wait(3000);
        battleScreen.classList.remove('dark-communion');
    }

    showDamageText(damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = damage;
        
        const unknown = document.querySelector('#unknown-container');
        const rect = unknown.getBoundingClientRect();
        
        damageText.style.left = `${rect.left + rect.width / 2}px`;
        damageText.style.top = `${rect.top + rect.height / 2}px`;
        
        document.body.appendChild(damageText);
        setTimeout(() => damageText.remove(), 1000);
    }

    async applyDamage(damage) {
        this.gameState.unknown.hp = Math.max(0, this.gameState.unknown.hp - damage);
        this.updateStatus();
        await this.wait(500);
    }

    async showRandomUnknownMessage() {
        const currentPhase = this.getCurrentPhase();
        const messages = this.vampireDialogues[currentPhase];
        const message = messages[Math.floor(Math.random() * messages.length)];
        await this.showMessage(message);
    }

    getCurrentPhase() {
        const hp = this.gameState.unknown.hp;
        for (const [phase, values] of Object.entries(this.battlePhases)) {
            if (hp <= values.hp && hp > values.threshold) {
                return phase;
            }
        }
        return 'normal';
    }

    checkBattleStatus() {
        if (this.gameState.unknown.hp <= 300 && !this.gameState.isFinalPhase) {
            this.executeFinalPhase();
        }
        this.updateStatus();
    }

    async executeFinalPhase() {
        this.gameState.isFinalPhase = true;
        await this.showMagicAnimation('boss');
        this.gameState.matsuri.hp = 1;
        await this.showMessage("UNKNOWNの最後の攻撃！MATSURIのHPが1になった！");
    }

    async showTrueEnding() {
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
        
        const endingTitle = document.querySelector('#ending-title');
        const endingMessage = document.querySelector('#ending-message');
        
        endingTitle.textContent = "GAME CLEAR";
        
        const messages = [
            "吸血鬼の呪いは解かれた...",
            "だが、新たな謎が待ち受けている。",
            "MATSURIの旅は、まだ始まったばかりだ。"
        ];

        for (const message of messages) {
            endingMessage.textContent = message;
            await this.wait(2000);
        }

        this.showElement('ending-choices');
    }

    showBadEnding(message) {
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
        
        document.querySelector('#ending-title').textContent = "GAME OVER";
        document.querySelector('#ending-message').textContent = message;
        this.showElement('ending-choices');
    }

    resetGame() {
        location.reload();
    }

    showMessage(text) {
        return new Promise(resolve => {
            const messageWindow = document.querySelector('#message-window');
            messageWindow.style.opacity = '0';
            
            setTimeout(() => {
                messageWindow.textContent = text;
                messageWindow.style.opacity = '1';
                resolve();
            }, 300);
        });
    }

    hideElement(id) {
        document.querySelector(`#${id}`).classList.add('hidden');
    }

    showElement(id) {
        document.querySelector(`#${id}`).classList.remove('hidden');
    }

    updateStatus() {
        // HP/MPバーの更新
        const updateBar = (current, max, barId) => {
            const bar = document.querySelector(`#${barId}`);
            const percentage = (current / max) * 100;
            bar.style.width = `${percentage}%`;
        };

        // テキスト更新
        document.querySelector('#matsuri-hp').textContent = this.gameState.matsuri.hp;
        document.querySelector('#matsuri-mp').textContent = this.gameState.matsuri.mp;
        document.querySelector('#unknown-hp').textContent = this.gameState.unknown.hp;

        // バー更新
        updateBar(this.gameState.matsuri.hp, this.gameState.matsuri.maxHp, 'matsuri-hp-bar');
        updateBar(this.gameState.matsuri.mp, this.gameState.matsuri.maxMp, 'matsuri-mp-bar');
        updateBar(this.gameState.unknown.hp, this.gameState.unknown.maxHp, 'unknown-hp-bar');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ゲーム開始
window.onload = () => new YumeAiFantasy();
