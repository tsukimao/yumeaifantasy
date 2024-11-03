class YumeAiFantasy {
    constructor() {
        // メソッドのバインド
        this.startGame = this.startGame.bind(this);
        this.nextStory = this.nextStory.bind(this);
        this.handleAttack = this.handleAttack.bind(this);
        this.handleMagic = this.handleMagic.bind(this);
        this.handleTalk = this.handleTalk.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.resetGame = this.resetGame.bind(this);

        this.initializeGame();
        this.bindEvents();
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
            currentScene: 'title',
            storyIndex: 0,
            isFinalPhase: false,
            isAnimating: false,
            darkCommunionInspired: false,
            battleCount: 0
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

        this.unknownBattleDialogues = [
            "永遠の命は祝福ではなく、呪いだ。愛する者たちの死を何度も見続ける運命なのだから",
            "時は流れ続け、私だけが取り残される。それが吸血鬼の宿命だ",
            "月明かりの下で何百年も生きてきた。だが、心の渇きは癒えることはない",
            "私の心臓は止まったまま。それでも、記憶だけは生き続ける",
            "永遠の時を生きることは、永遠に別れを繰り返すこと",
            "人間たちは私を怪物と呼ぶ。だが、彼らこそが時に最も残酷な存在だ",
            "血を求める渇きは永遠に続く。それでも、人間の命の尊さを忘れたことはない",
            "かつて人間だった記憶が薄れていく。それでも、人間の温もりだけは忘れられない",
            "人間の血は私の命の源。しかし、それは同時に最大の罪",
            "人間の世界で生きながら、決して人間になれない。これほどの皮肉があろうか",
            "太陽は私の敵。だが、夜の闇は最高の同志だ",
            "影の中でこそ、私たちは真の姿を見せる",
            "月の光に照らされる時、私は最も美しく、そして最も危険な存在となる",
            "夜の帳が下りる時、私の真の生が始まる",
            "闇は私の母であり、月は私の父",
            "人から吸血鬼への変容は、千の針で心を刺すような痛みだった",
            "最初の血の味を忘れない。あの瞬間、私は人間性を失った",
            "変貌の夜、私は人としての全てを失い、永遠の命を得た",
            "人間の姿を保っているが、内なる獣は常に血を求めている",
            "変身の痛みは永遠に続く。それは私の罪の印"
        ];

        this.unknownTalkDialogues = [
            "世紀を超えて生きる者には、記憶が重荷となる",
            "私の記憶は古い図書館のよう。数え切れない物語で満ちている",
            "時代は移り変わる。だが、私の姿だけは永遠に変わらない",
            "何百年もの記憶が重なり、時には自分が誰だったのかも分からなくなる",
            "過去の記憶は私を苦しめる。しかし、それは私の一部",
            "不死の力を持つことは、永遠の責任を負うこと",
            "私の力は呪いであり、同時に祝福でもある",
            "人間より強く、神より弱い。それが私たちの定め",
            "力を持つことは、常に選択を迫られること",
            "私の力は増すが、それと共に孤独も深まる",
            "愛する者との別れは、永遠の命の中で最も辛い試練",
            "人を愛することは許されない。それでも、心は愛を求める",
            "永遠の命は、永遠の別れの連続",
            "愛は私にとって最も危険な感情。それでも、抗うことはできない",
            "愛する者の死を見届けること。それが私の永遠の宿命",
            "この運命は選んだわけではない。だが、受け入れるしかなかった",
            "運命の糸は血で染まっている。それが私の道",
            "選択の自由はあっても、人間に戻る自由はない",
            "運命は私を吸血鬼にした。しかし、私の行動は私が選ぶ",
            "永遠の命は与えられた。だが、その使い方は私次第",
            "誰も私の真の姿を知らない。それが吸血鬼の宿命だ",
            "永遠の命を持つ者には、永遠の孤独が付きまとう",
            "夜ごと街を彷徨う。だが、帰るべき場所はどこにもない",
            "孤独は私の永遠の伴侶。最も忠実で、最も残酷な",
            "世界は変わり続ける。だが、私の孤独だけは変わらない",
            "永遠の闇の中にも、時として希望の光は見える",
            "絶望の底で見つけた希望。それが私を支える",
            "永遠の命は、新たな可能性への扉でもある",
            "夜明けは来ない。しかし、それは必ずしも絶望を意味しない",
            "永遠の命を持つ者にも、変化の可能性はある。それが私の希望"
        ];

        this.darkCommunionEvent = [
            "MATSURIは禁忌の魔法を思い出した...",
            "黒き聖餐よ、我が魂を捧げる...",
            "全てを終わらせる時が来た。"
        ];

        this.battlePhases = {
            normal: { hp: 2000, threshold: 1500 },
            wounded: { hp: 1500, threshold: 800 },
            desperate: { hp: 800, threshold: 300 },
            final: { hp: 300, threshold: 0 }
        };

        // ローディング画面を非表示にし、タイトル画面を表示
        this.hideElement('loading-screen');
        this.showElement('title-screen');
    }

    bindEvents() {
        // タイトル画面のイベント（PC・スマホ両対応）
        const titleScreen = document.getElementById('title-screen');
        if (titleScreen) {
            titleScreen.addEventListener('click', this.startGame);
            titleScreen.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.startGame();
            });
        }

        // ストーリー進行のイベント
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStory();
            });
            nextButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.nextStory();
            });
        }

        // 他のボタンのイベントリスナーは同じ
    }

    async updateStory() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        const storyText = document.getElementById('story-text');
        
        // デバッグログ追加
        console.log('Updating story:', this.gameState.storyIndex);
        console.log('Current text:', this.storySequence[this.gameState.storyIndex]);

        storyText.style.opacity = '0';
        await this.wait(300);
        
        storyText.textContent = this.storySequence[this.gameState.storyIndex];
        storyText.style.opacity = '1';
        
        this.gameState.isAnimating = false;
    }

    async nextStory() {
        if (this.gameState.isAnimating) return;

        // デバッグログ追加
        console.log('Next story clicked. Current index:', this.gameState.storyIndex);
        
        this.gameState.storyIndex++;
        
        if (this.gameState.storyIndex < this.storySequence.length) {
            await this.updateStory();
        } else {
            console.log('Starting battle');
            this.startBattle();
        }
    }

    startGame() {
        console.log('Game starting...');
        this.hideElement('title-screen');
        this.showElement('story-screen');
        this.gameState.currentScene = 'story';
        this.updateStory();
    }
        
    async startGame() {
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
        const storyText = document.getElementById('story-text');
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
        
        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        await this.showAttackAnimation('matsuri');
        this.showDamageText(damage);
        await this.applyDamage(damage);

        if (this.gameState.battleCount >= 30) {
            await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            this.showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        await this.showBattleMessage();
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

        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        let damage;

        if (this.gameState.darkCommunionInspired) {
            damage = this.gameState.unknown.hp;
            await this.executeDarkCommunion();
        } else {
            damage = Math.floor(Math.random() * 200) + 100;
            this.gameState.matsuri.mp -= 15;
            await this.showMagicAnimation('matsuri');
        }

        this.showDamageText(damage);
        await this.applyDamage(damage);

        if (this.gameState.battleCount >= 30) {
            await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            this.showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        if (this.gameState.darkCommunionInspired) {
            await this.showSpecialEnding();
        } else {
            await this.showBattleMessage();
            this.gameState.isAnimating = false;
            this.checkBattleStatus();
        }
    }

    async handleTalk() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.battleCount++;
        
        if (this.gameState.battleCount >= 30) {
            await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            this.showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        if (this.gameState.isFinalPhase) {
            await this.showMessage("ただの会話ではこの男を倒せないようだ...");
        } else {
            await this.showTalkMessage();
        }
        this.checkBattleStatus();
    }

    handleEscape() {
        this.showGameOver("MATSURIは吸血鬼にされました");
    }

    async showAttackAnimation(character) {
        const container = document.getElementById(`${character}-container`);
        container.classList.add('attack-animation');
        await this.wait(500);
        container.classList.remove('attack-animation');
    }

    async showMagicAnimation(character) {
        const effectLayer = document.getElementById('effect-layer');
        const effect = document.createElement('img');
        effect.src = `https://tsukimao.github.io/yumeaifantasy/${character}.mahou.gif`;
        effect.className = 'magic-effect';
        
        effectLayer.appendChild(effect);
        await this.wait(1000);
        effect.remove();
    }

    async executeDarkCommunion() {
        const flashLayer = document.getElementById('flash-layer');
        
        for (const text of this.darkCommunionEvent) {
            await this.showMessage(text);
            await this.wait(1000);
        }

        flashLayer.classList.remove('hidden');
        flashLayer.classList.add('flash');
        await this.showMagicAnimation('matsuri');
        await this.wait(1000);
        flashLayer.classList.remove('flash');
        flashLayer.classList.add('hidden');
    }

    showDamageText(damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = damage;
        
        const unknown = document.getElementById('unknown-container');
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

    async showBattleMessage() {
        const message = this.unknownBattleDialogues[
            Math.floor(Math.random() * this.unknownBattleDialogues.length)
        ];
        await this.showMessage(`UNKNOWN: 『${message}』`);
    }

    async showTalkMessage() {
        const message = this.unknownTalkDialogues[
            Math.floor(Math.random() * this.unknownTalkDialogues.length)
        ];
        await this.showMessage(`UNKNOWN: 『${message}』`);
    }

    async checkBattleStatus() {
        if (this.gameState.unknown.hp <= 300 && !this.gameState.isFinalPhase) {
            await this.executeFinalPhase();
        } else if (this.gameState.unknown.hp <= 1000 && !this.gameState.darkCommunionInspired) {
            await this.inspireDarkCommunion();
        }
        this.updateStatus();
    }

    async executeFinalPhase() {
        this.gameState.isFinalPhase = true;
        await this.showMagicAnimation('boss');
        this.gameState.matsuri.hp = 1;
        await this.showMessage("UNKNOWNの最後の攻撃！MATSURIのHPが1になった！");
        await this.showMessage("ただの攻撃ではこの男を倒せないようだ...");
        document.getElementById('attack').disabled = true;
        document.getElementById('magic').disabled = true;
    }

    async inspireDarkCommunion() {
        this.gameState.darkCommunionInspired = true;
        await this.showMessage("MATSURIは何かを思い出しそうになった...");
        await this.showMessage("「黒の聖餐」という言葉が頭をよぎる...");
        document.getElementById('magic').textContent = "黒の聖餐";
        document.getElementById('magic').classList.add('special-skill');
    }

    async showSpecialEnding() {
        await this.showMessage("黒の聖餐の力が解き放たれた！");
        await this.showMessage("UNKNOWNの姿が光に包まれていく...");
        await this.showMessage("UNKNOWN: 『ありがとう...やっと解放される...』");
        
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
        
        document.getElementById('ending-title').textContent = "TRUE END";
        document.getElementById('ending-message').textContent = 
            "MATSURIは吸血鬼の呪いを解き、新たな冒険へと旅立つ...";
        
        this.showElement('ending-choices');
    }

    showGameOver(message) {
        this.hideElement('battle-screen');
        this.showElement('gameover-screen');
        document.getElementById('gameover-message').textContent = message;
    }

    showMessage(text) {
        return new Promise(resolve => {
            const messageWindow = document.getElementById('message-text');
            messageWindow.style.opacity = '0';
            
            setTimeout(() => {
                messageWindow.textContent = text;
                messageWindow.style.opacity = '1';
                resolve();
            }, 300);
        });
    }

    hideElement(id) {
        document.getElementById(id).classList.add('hidden');
    }

    showElement(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    updateStatus() {
        const updateBar = (current, max, barId) => {
            const bar = document.getElementById(barId);
            const percentage = (current / max) * 100;
            bar.style.width = `${percentage}%`;
        };

        document.getElementById('matsuri-hp').textContent = this.gameState.matsuri.hp;
        document.getElementById('matsuri-mp').textContent = this.gameState.matsuri.mp;

        updateBar(this.gameState.matsuri.hp, this.gameState.matsuri.maxHp, 'matsuri-hp-bar');
        updateBar(this.gameState.matsuri.mp, this.gameState.matsuri.maxMp, 'matsuri-mp-bar');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetGame() {
        location.reload();
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    window.game = new YumeAiFantasy();
});
