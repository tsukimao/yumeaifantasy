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
                name: "MATSURI"
            },
            unknown: {
                hp: 2000,
                name: "UNKNOWN"
            },
            currentScene: 'title',
            storyIndex: 0,
            isFinalPhase: false,
            isAnimating: false
        };

        this.unknownMessages = [
            "吸血鬼は人間の血を吸い、永遠の命を手に入れる。",
            "私はかつて美しい花嫁だった。だが、運命は私を吸血鬼へと変えた。",
            "吸血鬼は月明かりを避ける。太陽は私たちの敵だ。",
            "吸血鬼は人間の心を操り、恐怖を植え付ける。",
            "吸血鬼は一度死んだ者たち。だが、私はその中でも最も恐ろしい。",
            "私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。",
            "吸血鬼は人間をゾンビに変えると噂される。だが、それは嘘だ。",
            "昔、吸血鬼は一族を形成し、世界を支配していた。",
            "吸血鬼は夜に活動する。だが、私は日中でも活動できる。",
            "私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。"
        ];

        this.storySequence = [
            "MATSURIは男を追い詰めた",
            "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
            "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
            "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
            "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
            "MATSURIは危険を感じた。この男は一体。",
            "戦闘を開始します。"
        ];

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

    startGame() {
        this.hideElement('title-screen');
        this.showElement('story-screen');
        this.updateStory();
    }

    nextStory() {
        this.gameState.storyIndex++;
        if (this.gameState.storyIndex < this.storySequence.length) {
            this.updateStory();
        } else {
            this.startBattle();
        }
    }

    updateStory() {
        const storyText = document.querySelector('#story-text');
        storyText.style.opacity = '0';
        setTimeout(() => {
            storyText.textContent = this.storySequence[this.gameState.storyIndex];
            storyText.style.opacity = '1';
        }, 300);
    }

    startBattle() {
        this.hideElement('story-screen');
        this.showElement('battle-screen');
        this.updateStatus();
        this.showMessage("コマンドを選択してください。");
    }

    handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        this.showEffect('matsuri');
        this.showDamageText(damage);
        
        setTimeout(() => {
            this.applyDamage(damage);
            this.showRandomUnknownMessage();
            this.gameState.isAnimating = false;
            this.checkBattleStatus();
        }, 1000);
    }

    handleMagic() {
        if (this.gameState.isAnimating || this.gameState.matsuri.mp < 15) {
            if (this.gameState.matsuri.mp < 15) {
                this.showMessage("MPが足りません！");
            }
            return;
        }

        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 200) + 100;
        this.gameState.matsuri.mp -= 15;

        this.showEffect('matsuri');
        this.showDamageText(damage);

        setTimeout(() => {
            this.applyDamage(damage);
            this.showRandomUnknownMessage();
            this.gameState.isAnimating = false;
            this.checkBattleStatus();
        }, 1000);
    }

    handleTalk() {
        if (this.gameState.isAnimating) return;
        
        if (this.gameState.isFinalPhase) {
            this.showTrueEnding();
        } else {
            this.showRandomUnknownMessage();
        }
    }

    handleEscape() {
        this.showBadEnding("MATSURIは吸血鬼にされました");
    }

    showEffect(type) {
        const effectLayer = document.querySelector('#effect-layer');
        const effect = document.createElement('img');
        effect.src = type === 'matsuri' ? 
            'https://tsukimao.github.io/yumeaifantasy/matsuri.mahou.gif' :
            'https://tsukimao.github.io/yumeaifantasy/boss.mahou.gif';
        
        effect.style.position = 'absolute';
        effect.style.width = '100%';
        effect.style.height = '100%';
        effect.style.objectFit = 'contain';
        
        effectLayer.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    showDamageText(damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = damage;
        damageText.style.left = '30%';
        damageText.style.top = '40%';
        
        document.querySelector('#battle-screen').appendChild(damageText);
        
        setTimeout(() => {
            damageText.remove();
        }, 1000);
    }

    applyDamage(damage) {
        this.gameState.unknown.hp = Math.max(0, this.gameState.unknown.hp - damage);
        this.updateStatus();
    }

    showRandomUnknownMessage() {
        const message = this.unknownMessages[Math.floor(Math.random() * this.unknownMessages.length)];
        this.showMessage(message);
    }

    checkBattleStatus() {
        if (this.gameState.unknown.hp <= 300 && !this.gameState.isFinalPhase) {
            this.executeFinalPhase();
        }
        this.updateStatus();
    }

    executeFinalPhase() {
        this.gameState.isFinalPhase = true;
        this.showEffect('unknown');
        this.gameState.matsuri.hp = 1;
        this.showMessage("UNKNOWNの最後の攻撃！MATSURIのHPが1になった！");
    }

    showTrueEnding() {
        this.showMessage("MATSURIは禁忌の魔法、グランドクロスを発動した！");
        document.querySelector('#battle-screen').style.backgroundColor = 'white';
        
        setTimeout(() => {
            this.showMessage("UNKNOWNの姿が消えていく...");
            setTimeout(() => {
                this.showEnding(true);
            }, 2000);
        }, 2000);
    }

    showBadEnding(message) {
        this.showEnding(false, message);
    }

    showEnding(isTrue, message = null) {
        const endingMessage = isTrue ? 
            "MATSURIは引き続きUNKNOWNを探す旅に出る..." :
            message;

        document.querySelector('#ending-message').textContent = endingMessage;
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
    }

    resetGame() {
        location.reload();
    }

    showMessage(text) {
        const messageWindow = document.querySelector('#message-window');
        messageWindow.style.opacity = '0';
        setTimeout(() => {
            messageWindow.textContent = text;
            messageWindow.style.opacity = '1';
        }, 300);
    }

    hideElement(id) {
        document.querySelector(`#${id}`).classList.add('hidden');
    }

    showElement(id) {
        document.querySelector(`#${id}`).classList.remove('hidden');
    }

    updateStatus() {
        document.querySelector('#matsuri-hp').textContent = this.gameState.matsuri.hp;
        document.querySelector('#matsuri-mp').textContent = this.gameState.matsuri.mp;
        document.querySelector('#unknown-hp').textContent = this.gameState.unknown.hp;
    }
}

window.onload = () => new YumeAiFantasy();
