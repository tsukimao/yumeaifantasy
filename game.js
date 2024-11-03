// game.js
class YumeAiFantasy {
    constructor() {
        this.initializeGame();
        this.bindEvents();
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

        assets.forEach(asset => {
            const img = new Image();
            img.src = `https://tsukimao.github.io/yumeaifantasy/${asset}`;
        });
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
        
        effectLayer.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        this.showEffect('matsuri');
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
        setTimeout(() => {
            this.applyDamage(damage);
            this.showRandomUnknownMessage();
            this.gameState.isAnimating = false;
            this.checkBattleStatus();
        }, 1000);
    }

    handleTalk() {
        if (this.gameState.isFinalPhase) {
            this.showTrueEnding();
        } else {
            this.showRandomUnknownMessage();
        }
    }

    showTrueEnding() {
        this.showMessage("MATSURIは禁忌の魔法、グランドクロスを発動した！");
        setTimeout(() => {
            document.querySelector('#battle-screen').style.backgroundColor = 'white';
            setTimeout(() => {
                this.showMessage("UNKNOWNの姿が消えていく...");
                setTimeout(() => {
                    this.showEnding(true);
                }, 2000);
            }, 2000);
        }, 2000);
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

    showEnding(isTrue) {
        const message = isTrue ? 
            "MATSURIは引き続きUNKNOWNを探す旅に出る..." :
            "MATSURIは吸血鬼にされました";

        document.querySelector('#ending-message').textContent = message;
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
    }

    showRandomUnknownMessage() {
        const message = this.unknownMessages[Math.floor(Math.random() * this.unknownMessages.length)];
        this.showMessage(message);
    }

    // ... 他のメソッドは前回のコードと同じ
}

window.onload = () => new YumeAiFantasy();
