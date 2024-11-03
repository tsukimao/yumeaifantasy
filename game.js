class YumeAiFantasy {
    // ストーリーとテキストデータの定義
    initializeStoryAndDialogues() {
        // ストーリーテキスト
        this.storySequence = [
            "MATSURIは男を追い詰めた",
            "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
            "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
            "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
            "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
            "MATSURIは危険を感じた。この男は一体。",
            "戦闘を開始します。"
        ];

        // エンディングストーリー
        this.endingStory = [
            "永き夜の終わりに、一筋の光が差し込む。",
            "幾百年もの間、永遠の命という呪いに縛られ続けた魂が、今、解放の時を迎えようとしていた。",
            "黒の聖餐――それは、人の世の理から外れた存在を、本来あるべき姿へと導く禁忌の魔法。",
            "MATSURIの詠唱が終わりに近づくにつれ、UNKNOWNの姿は淡い光に包まれていく。",
            "「ありがとう...」",
            "その声には、もはや吸血鬼としての冷たさはなく、ただ安らかな温もりだけが残されていた。",
            "「永遠の命は、私にとって祝福ではなく、呪いだった。」",
            "「しかし、お前との出会いによって、その呪いから解放される。」",
            "「私は...やっと...眠ることができる...」",
            "光に包まれたUNKNOWNの姿が、静かに消えていく。",
            "その表情には、何百年ぶりかの安らぎが浮かんでいた。",
            "永遠の命という重荷から解放された魂は、新たな夜明けとともに生まれ変わることだろう。",
            "これは、一人の吸血鬼と、その呪いを解いた少女の物語。",
            "永遠の命の重さと、解放への祈りを胸に、MATSURIは新たな冒険への一歩を踏み出すのであった。"
        ];

        // 戦闘時の台詞
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
            "人間の世界で生きながら、決して人間になれない。これほどの皮肉があろうか"
        ];

        // 会話時の台詞
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
            "私の力は増すが、それと共に孤独も深まる"
        ];

        // 黒の聖餐イベントのテキスト
        this.darkCommunionEvent = [
            "MATSURIは禁忌の魔法を思い出した...",
            "「解放の時が来た...」",
            "「永遠の命の重さよ、今こそ解き放たれよ...」",
            "黒き聖餐よ、我が魂を捧げる...",
            "「この呪いの連鎖を、今ここで断ち切る！」",
            "全てを終わらせる時が来た。"
        ];
    }

    constructor() {
        this.isInitialized = false;
        this.isTransitioning = false;
        this.initializeStoryAndDialogues();
        this.setupEffectSystem();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        console.log('Starting game initialization...');
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';

        try {
            await this.initializeGame();
            this.bindEvents();
            this.isInitialized = true;
            
            loadingScreen.style.display = 'none';
            const titleScreen = document.getElementById('title-screen');
            titleScreen.style.display = 'flex';
            titleScreen.style.opacity = '0';
            await this.fadeIn(titleScreen);
            
            console.log('Game started successfully');
        } catch (error) {
            console.error('Game start failed:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeGame() {
        this.gameState = {
            currentScene: 'title',
            storyIndex: 0,
            isAnimating: false,
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
            battleCount: 0,
            darkCommunionInspired: false,
            isFinalPhase: false
        };

        await this.preloadAssets();
    }

    async preloadAssets() {
        const assets = [
            'YUMEAIFANTASY.title.gif',
            'BG.png',
            'yumeaimatsuri.png',
            'boss.png'
        ];

        const promises = assets.map(asset => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = `https://tsukimao.github.io/yumeaifantasy/${asset}`;
            });
        });

        try {
            await Promise.all(promises);
            console.log('Assets loaded successfully');
        } catch (error) {
            console.error('Asset loading failed:', error);
            throw error;
        }
    }

    setupEffectSystem() {
        this.effectTypes = {
            FLASH: {
                duration: 300,
                create: () => {
                    const flash = document.getElementById('screen-flash');
                    flash.classList.remove('hidden');
                    flash.classList.add('active');
                    setTimeout(() => {
                        flash.classList.remove('active');
                        flash.classList.add('hidden');
                    }, 300);
                }
            },
            SHAKE: {
                duration: 500,
                create: () => {
                    const container = document.getElementById('game-container');
                    container.classList.add('screen-shake');
                    setTimeout(() => {
                        container.classList.remove('screen-shake');
                    }, 500);
                }
            },
            PARTICLES: {
                duration: 1000,
                create: (x, y, count = 10) => {
                    this.createParticles(x, y, count);
                }
            }
        };
    }
        bindEvents() {
        this.removeExistingEventListeners();

        // タイトル画面
        const titleScreen = document.getElementById('title-screen');
        titleScreen.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            
            try {
                await this.fadeOut(titleScreen);
                titleScreen.style.display = 'none';
                await this.startStory();
            } finally {
                this.isTransitioning = false;
            }
        });

        // ストーリー進行
        const nextButton = document.getElementById('next-button');
        nextButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            
            try {
                await this.progressStory();
            } finally {
                this.isTransitioning = false;
            }
        });

        // 戦闘コマンド
        this.setupBattleCommands();

        // エンディング画面のボタン
        const retryEnding = document.getElementById('retry-ending');
        retryEnding.addEventListener('click', () => {
            this.playEffect('FLASH');
            setTimeout(() => this.resetGame(), 300);
        });

        const visitSite = document.getElementById('visit-site');
        visitSite.addEventListener('click', () => {
            window.location.href = 'https://reverieneon71.my.canva.site/';
        });

        // ゲームオーバー画面のリトライ
        const retryGameover = document.getElementById('retry-gameover');
        retryGameover.addEventListener('click', () => {
            this.playEffect('FLASH');
            setTimeout(() => this.resetGame(), 300);
        });
    }

    setupBattleCommands() {
        const commands = {
            'attack': this.handleAttack.bind(this),
            'magic': this.handleMagic.bind(this),
            'talk': this.handleTalk.bind(this),
            'escape': this.handleEscape.bind(this)
        };

        Object.entries(commands).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                if (!this.isTransitioning && this.gameState.currentScene === 'battle') {
                    await handler();
                }
            });
        });
    }

    removeExistingEventListeners() {
        const elements = [
            'title-screen', 'next-button', 'attack', 'magic', 
            'talk', 'escape', 'retry-ending', 'visit-site', 'retry-gameover'
        ];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            }
        });
    }

    async startStory() {
        const storyScreen = document.getElementById('story-screen');
        storyScreen.classList.remove('hidden');
        storyScreen.style.opacity = '0';
        await this.fadeIn(storyScreen);
        await this.updateStory();
    }

    async progressStory() {
        this.gameState.storyIndex++;
        if (this.gameState.storyIndex < this.storySequence.length) {
            await this.updateStory();
        } else {
            await this.startBattle();
        }
    }

    async updateStory() {
        const storyText = document.getElementById('story-text');
        await this.fadeOut(storyText);
        storyText.textContent = this.storySequence[this.gameState.storyIndex];
        await this.fadeIn(storyText);
    }
        async startBattle() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            const storyScreen = document.getElementById('story-screen');
            await this.fadeOut(storyScreen);
            storyScreen.classList.add('hidden');

            const battleScreen = document.getElementById('battle-screen');
            battleScreen.classList.remove('hidden');
            await this.fadeIn(battleScreen);

            this.gameState.currentScene = 'battle';
            this.updateStatus();
            await this.showMessage("コマンドを選択してください。");
            this.enableBattleCommands();
        } catch (error) {
            console.error('Battle transition failed:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    async handleAttack() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            this.gameState.battleCount++;
            const damage = Math.floor(Math.random() * 20) + 40;
            
            const matsuriContainer = document.getElementById('matsuri-container');
            matsuriContainer.classList.add('attacking');
            
            await this.playEffects([
                { type: 'FLASH' },
                { type: 'SHAKE' }
            ]);

            await this.showDamageText(damage);
            await this.applyDamage(damage);
            
            matsuriContainer.classList.remove('attacking');

            if (this.gameState.battleCount >= 30) {
                await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
                this.showGameOver("MATSURIは吸血鬼にされました");
                return;
            }

            await this.showBattleMessage();
            await this.checkBattleStatus();
        } finally {
            this.isTransitioning = false;
        }
    }

    async handleMagic() {
        if (this.isTransitioning || this.gameState.matsuri.mp < 15) {
            if (this.gameState.matsuri.mp < 15) {
                await this.showMessage("MPが足りません！");
            }
            return;
        }

        this.isTransitioning = true;
        try {
            this.gameState.battleCount++;
            let damage;

            if (this.gameState.darkCommunionInspired) {
                damage = this.gameState.unknown.hp;
                await this.executeDarkCommunion();
            } else {
                damage = Math.floor(Math.random() * 200) + 100;
                this.gameState.matsuri.mp -= 15;
                await this.executeMagicAttack();
            }

            await this.showDamageText(damage);
            await this.applyDamage(damage);

            if (this.gameState.battleCount >= 30) {
                await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
                this.showGameOver("MATSURIは吸血鬼にされました");
                return;
            }

            if (this.gameState.darkCommunionInspired && this.gameState.unknown.hp <= 0) {
                await this.showSpecialEnding();
            } else {
                await this.showBattleMessage();
                await this.checkBattleStatus();
            }
        } finally {
            this.isTransitioning = false;
        }
    }

    async executeMagicAttack() {
        const matsuriContainer = document.getElementById('matsuri-container');
        const magicCircle = document.createElement('div');
        magicCircle.className = 'magic-circle-effect';
        matsuriContainer.appendChild(magicCircle);

        await this.playEffects([
            { type: 'FLASH' },
            { type: 'PARTICLES', x: window.innerWidth / 2, y: window.innerHeight / 2, count: 20 }
        ]);

        await this.wait(1000);
        magicCircle.remove();
    }

    async executeDarkCommunion() {
        document.getElementById('battle-screen').classList.add('dark-communion-active');
        const darkCommunionEffects = document.getElementById('dark-communion-effects');
        darkCommunionEffects.classList.remove('hidden');

        for (const text of this.darkCommunionEvent) {
            await this.showMessage(text);
            await this.wait(2000);
            
            this.createParticles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                30,
                { color: '#800080', duration: 2000 }
            );
        }

        await this.playEffects([
            { type: 'FLASH' },
            { type: 'SHAKE' }
        ]);

        const flashLayer = document.getElementById('flash-layer');
        flashLayer.style.backgroundColor = '#800080';
        flashLayer.classList.remove('hidden');
        await this.wait(2000);
        flashLayer.classList.add('hidden');

        document.getElementById('battle-screen').classList.remove('dark-communion-active');
        darkCommunionEffects.classList.add('hidden');
    }
        async handleTalk() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
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
                
                if (this.gameState.unknown.hp <= 1000 && !this.gameState.darkCommunionInspired) {
                    if (Math.random() < 0.3) {
                        await this.inspireDarkCommunion();
                    }
                }
            }
            
            await this.checkBattleStatus();
        } finally {
            this.isTransitioning = false;
        }
    }

    handleEscape() {
        if (!this.isTransitioning) {
            this.showGameOver("MATSURIは吸血鬼にされました");
        }
    }

    async showMessage(text) {
        const messageText = document.getElementById('message-text');
        if (!messageText) return;

        await this.fadeOut(messageText);
        messageText.textContent = '';
        
        // 文字送りエフェクト
        for (const char of text) {
            messageText.textContent += char;
            await this.wait(30);
        }
        
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

    async showDamageText(damage) {
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
        
        const magicButton = document.getElementById('magic');
        magicButton.textContent = "黒の聖餐";
        magicButton.classList.add('special-skill');
    }
        async showSpecialEnding() {
        this.isTransitioning = true;
        
        try {
            await this.fadeOut(document.getElementById('battle-screen'));
            this.hideElement('battle-screen');
            this.showElement('ending-screen');
            
            const endingTitle = document.getElementById('ending-title');
            const endingStory = document.getElementById('ending-story');
            const endingMessage = document.getElementById('ending-message');
            const endingChoices = document.getElementById('ending-choices');

            // タイトル表示
            endingTitle.textContent = "TRUE END";
            await this.fadeIn(endingTitle);
            await this.wait(2000);

            // エンディングストーリーの表示
            for (const text of this.endingStory) {
                await this.fadeOut(endingStory);
                endingStory.textContent = text;
                await this.fadeIn(endingStory);
                await this.wait(4000);
            }

            // 最終メッセージ
            await this.fadeOut(endingMessage);
            endingMessage.innerHTML = 
                "永遠の闇から解放された魂は、<br>" +
                "新たな夜明けとともに生まれ変わる。<br><br>" +
                "そして物語は、新たな冒険の序章となる。";
            await this.fadeIn(endingMessage);
            await this.wait(3000);

            // 選択肢の表示
            endingChoices.classList.remove('hidden');
            endingChoices.style.opacity = '0';
            await this.wait(500);
            endingChoices.style.opacity = '1';

            // エンディングパーティクル開始
            this.startEndingParticles();
        } finally {
            this.isTransitioning = false;
        }
    }

    startEndingParticles() {
        const particleContainer = document.querySelector('.ending-particles');
        if (!particleContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particleContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 5000);
        };

        const particleInterval = setInterval(createParticle, 200);
        setTimeout(() => clearInterval(particleInterval), 300000);
    }

    // ユーティリティ関数
    async fadeIn(element, duration = 500) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.display = 'block';
        await element.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: duration,
            easing: 'ease-in-out'
        }).finished;
        element.style.opacity = '1';
    }

    async fadeOut(element, duration = 500) {
        if (!element) return;
        await element.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-in-out'
        }).finished;
        element.style.opacity = '0';
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.remove('hidden');
    }

    // デバッグ機能
    debug() {
        return {
            state: this.gameState,
            forcePhase: (phase) => {
                this.gameState.isFinalPhase = phase === 'final';
                this.updateStatus();
            },
            triggerDarkCommunion: () => {
                this.gameState.darkCommunionInspired = true;
                this.updateStatus();
            },
            setHP: (value) => {
                this.gameState.unknown.hp = value;
                this.updateStatus();
            },
            testEffect: (effectType) => {
                this.playEffect(effectType.toUpperCase());
            },
            showEnding: () => {
                this.showSpecialEnding();
            }
        };
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing game...');
    window.game = new YumeAiFantasy();
});
