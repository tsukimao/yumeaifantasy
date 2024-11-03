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

    bindEvents() {
        document.querySelector('#title-screen').addEventListener('click', () => this.startGame());
        document.querySelector('#next-button').addEventListener('click', () => this.nextStory());
        document.querySelector('#attack').addEventListener('click', () => this.handleAttack());
        document.querySelector('#magic').addEventListener('click', () => this.handleMagic());
        document.querySelector('#talk').addEventListener('click', () => this.handleTalk());
        document.querySelector('#escape').addEventListener('click', () => this.handleEscape());
        document.querySelector('#retry').addEventListener('click', () => this.resetGame());
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
        document.querySelector('#story-text').textContent = 
            this.storySequence[this.gameState.storyIndex];
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
            this.show
