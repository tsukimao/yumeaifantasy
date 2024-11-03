class YumeAiFantasy {
    constructor() {
        this.initializeStoryAndDialogues();
        this.isInitialized = false;
        this.animationFrame = null;
        this.setupEffectSystem();
        this.initializeGame().then(() => {
            this.bindEvents();
            this.isInitialized = true;
        });
    }

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
            "永遠の命は与えられた。だが、その使い方は私次第"
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

    async initializeGame() {
        console.log('Initializing game...');
        
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';

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

        try {
            await this.preloadAssets();
            loadingScreen.style.display = 'none';
            const titleScreen = document.getElementById('title-screen');
            titleScreen.style.display = 'flex';
            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Initialization failed:', error);
            this.handleInitializationError();
        }
    }

    async preloadAssets() {
        const images = [
            'YUMEAIFANTASY.title.gif',
            'BG.png',
            'yumeaimatsuri.png',
            'boss.png'
        ];

        const imagePromises = images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = `https://tsukimao.github.io/yumeaifantasy/${src}`;
            });
        });

        try {
            await Promise.all(imagePromises);
            console.log('Assets loaded successfully');
        } catch (error) {
            throw new Error('Asset loading failed');
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
                    const container = document.getElementById('particle-container');
                    for (let i = 0; i < count; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = `${x}px`;
                        particle.style.top = `${y}px`;
                        const angle = (Math.random() * 360) * (Math.PI / 180);
                        const velocity = Math.random() * 5 + 2;
                        const dx = Math.cos(angle) * velocity;
                        const dy = Math.sin(angle) * velocity;
                        particle.style.transform = `translate(${dx}px, ${dy}px)`;
                        container.appendChild(particle);
                        setTimeout(() => particle.remove(), 1000);
                    }
                }
            }
        };
    }
        bindEvents() {
        this.removeExistingEventListeners();

        // タイトル画面
        const titleScreen = document.getElementById('title-screen');
        titleScreen.addEventListener('click', async (e) => {
            if (!this.isInitialized || this.gameState.isAnimating) return;
            e.preventDefault();
            await this.startStory();
        });

        // ストーリー進行
        const nextButton = document.getElementById('next-button');
        nextButton.addEventListener('click', async (e) => {
            if (this.gameState.isAnimating) return;
            e.preventDefault();
            
            this.gameState.storyIndex++;
            if (this.gameState.storyIndex < this.storySequence.length) {
                await this.updateStory();
            } else {
                await this.startBattle();
            }
        });

        // 戦闘コマンド
        this.setupBattleCommands();

        // エンディング画面のボタン
        const retryEnding = document.getElementById('retry-ending');
        if (retryEnding) {
            retryEnding.addEventListener('click', () => {
                this.playEffect('FLASH');
                setTimeout(() => this.resetGame(), 300);
            });
        }

        const visitSite = document.getElementById('visit-site');
        if (visitSite) {
            visitSite.addEventListener('click', () => {
                window.location.href = 'https://reverieneon71.my.canva.site/';
            });
        }

        // ゲームオーバー画面のリトライ
        const retryGameover = document.getElementById('retry-gameover');
        if (retryGameover) {
            retryGameover.addEventListener('click', () => {
                this.playEffect('FLASH');
                setTimeout(() => this.resetGame(), 300);
            });
        }
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
            if (button) {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.gameState.isAnimating && this.gameState.currentScene === 'battle') {
                        await handler();
                    }
                });
            }
        });
    }

    removeExistingEventListeners() {
        const elements = ['title-screen', 'next-button', 'attack', 'magic', 'talk', 'escape', 'retry-ending', 'visit-site', 'retry-gameover'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            }
        });
    }

    async startStory() {
        this.gameState.isAnimating = true;
        await this.fadeOut(document.getElementById('title-screen'));
        this.hideElement('title-screen');
        this.showElement('story-screen');
        this.gameState.currentScene = 'story';
        this.gameState.isAnimating = false;
        await this.updateStory();
    }

    async updateStory() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.isAnimating = true;
        const storyText = document.getElementById('story-text');
        
        await this.fadeOut(storyText);
        storyText.textContent = this.storySequence[this.gameState.storyIndex];
        await this.fadeIn(storyText);
        
        this.gameState.isAnimating = false;
    }

    async startBattle() {
        this.gameState.isAnimating = true;
        await this.fadeOut(document.getElementById('story-screen'));
        this.hideElement('story-screen');
        this.showElement('battle-screen');
        this.gameState.currentScene = 'battle';
        this.updateStatus();
        this.gameState.isAnimating = false;
        await this.showMessage("コマンドを選択してください。");
    }
        // 戦闘コマンド処理
    async handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        // 攻撃エフェクトシーケンス
        const matsuriContainer = document.getElementById('matsuri-container');
        const unknownContainer = document.getElementById('unknown-container');
        
        matsuriContainer.classList.add('attacking');
        await this.playEffects([
            { type: 'FLASH' },
            { type: 'SHAKE' }
        ]);
        
        await this.wait(300);
        matsuriContainer.classList.remove('attacking');
        
        // ダメージ処理
        unknownContainer.classList.add('damaged');
        this.showDamageText(damage);
        this.createParticles(
            unknownContainer.offsetLeft + unknownContainer.offsetWidth / 2,
            unknownContainer.offsetTop + unknownContainer.offsetHeight / 2,
            10,
            { color: '#ff0000' }
        );
        
        await this.applyDamage(damage);
        await this.wait(500);
        unknownContainer.classList.remove('damaged');

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
                await this.showMessage("MPが足りません！");
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
            await this.executeMagicAttack();
        }

        this.showDamageText(damage);
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
            this.gameState.isAnimating = false;
            this.checkBattleStatus();
        }
    }

    async handleTalk() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        
        if (this.gameState.battleCount >= 30) {
            await this.showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            this.showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        if (this.gameState.isFinalPhase) {
            await this.showMessage("ただの会話ではこの男を倒せないようだ...");
        } else {
            await this.showTalkMessage();
            
            // 黒の聖餐解放チェック
            if (this.gameState.unknown.hp <= 1000 && !this.gameState.darkCommunionInspired) {
                if (Math.random() < 0.3) { // 30%の確率で発動
                    await this.inspireDarkCommunion();
                }
            }
        }
        
        this.gameState.isAnimating = false;
        this.checkBattleStatus();
    }

    handleEscape() {
        if (!this.gameState.isAnimating) {
            this.showGameOver("MATSURIは吸血鬼にされました");
        }
    }

    async executeMagicAttack() {
        const matsuriContainer = document.getElementById('matsuri-container');
        const unknownContainer = document.getElementById('unknown-container');

        // 魔法陣エフェクト
        const magicCircle = document.createElement('div');
        magicCircle.className = 'magic-circle-effect';
        matsuriContainer.appendChild(magicCircle);

        await this.playEffects([
            { type: 'FLASH' },
            { type: 'PARTICLES' }
        ]);

        await this.wait(1000);
        magicCircle.remove();
    }
        // 黒の聖餐関連の処理
    async executeDarkCommunion() {
        document.getElementById('battle-screen').classList.add('dark-communion-active');
        const darkCommunionEffects = document.getElementById('dark-communion-effects');
        darkCommunionEffects.classList.remove('hidden');

        // 詠唱エフェクトシーケンス
        for (const text of this.darkCommunionEvent) {
            await this.showMessage(text);
            await this.wait(2000);
            
            // パーティクルエフェクト
            this.createParticles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                30,
                { color: '#800080', duration: 2000 }
            );
        }

        // クライマックスエフェクト
        await this.playEffects([
            { type: 'FLASH' },
            { type: 'SHAKE' }
        ]);

        await this.wait(1000);

        // 最終エフェクト
        const flashLayer = document.getElementById('flash-layer');
        flashLayer.style.backgroundColor = '#800080';
        flashLayer.classList.remove('hidden');
        await this.wait(2000);
        flashLayer.classList.add('hidden');

        // エフェクトのクリーンアップ
        document.getElementById('battle-screen').classList.remove('dark-communion-active');
        darkCommunionEffects.classList.add('hidden');
    }

    async inspireDarkCommunion() {
        this.gameState.darkCommunionInspired = true;
        await this.showMessage("MATSURIは何かを思い出しそうになった...");
        await this.showMessage("「黒の聖餐」という言葉が頭をよぎる...");
        
        const magicButton = document.getElementById('magic');
        magicButton.textContent = "黒の聖餐";
        magicButton.classList.add('special-skill');
        
        // 特殊エフェクト
        await this.playEffects([
            { type: 'FLASH' },
            { type: 'PARTICLES' }
        ]);
    }

    // エンディング処理
    async showSpecialEnding() {
        this.gameState.isAnimating = true;
        
        // バトル画面からエンディングへの遷移
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
            await this.wait(4000); // テキスト表示時間を延長
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
        
        this.gameState.isAnimating = false;
    }

    // エンディングパーティクルエフェクト
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

        // パーティクル生成の間隔を設定
        const particleInterval = setInterval(createParticle, 200);
        
        // 5分後にエフェクトを停止（メモリ管理のため）
        setTimeout(() => clearInterval(particleInterval), 300000);
    }
        // ユーティリティ関数
    async playEffects(effects) {
        const promises = effects.map(effect => {
            return new Promise(resolve => {
                this.playEffect(effect.type, effect.options);
                setTimeout(resolve, this.effectTypes[effect.type].duration);
            });
        });
        await Promise.all(promises);
    }

    playEffect(effectType, options = {}) {
        const effect = this.effectTypes[effectType];
        if (effect) {
            effect.create(options);
        }
    }

    createParticles(x, y, count, options = {}) {
        const defaults = {
            color: 'white',
            size: '3px',
            duration: 1000
        };
        const settings = { ...defaults, ...options };

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            Object.assign(particle.style, {
                left: `${x}px`,
                top: `${y}px`,
                width: settings.size,
                height: settings.size,
                backgroundColor: settings.color
            });

            document.getElementById('particle-container').appendChild(particle);
            setTimeout(() => particle.remove(), settings.duration);
        }
    }

    async showMessage(text) {
        const messageText = document.getElementById('message-text');
        await this.fadeOut(messageText, 300);
        messageText.textContent = text;
        await this.fadeIn(messageText, 300);
        await this.wait(1500);
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

    async fadeOut(element, duration = 500) {
        await this.animate(element, {
            opacity: [1, 0]
        }, {
            duration: duration,
            easing: 'ease-out'
        });
    }

    async fadeIn(element, duration = 500) {
        await this.animate(element, {
            opacity: [0, 1]
        }, {
            duration: duration,
            easing: 'ease-in'
        });
    }

    animate(element, keyframes, options) {
        return new Promise(resolve => {
            const animation = element.animate(keyframes, options);
            animation.onfinish = resolve;
        });
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

    updateStatus() {
        const updateBar = (current, max, barId) => {
            const bar = document.getElementById(barId);
            if (bar) {
                const percentage = (current / max) * 100;
                bar.style.width = `${percentage}%`;
            }
        };

        document.getElementById('matsuri-hp').textContent = this.gameState.matsuri.hp;
        document.getElementById('matsuri-mp').textContent = this.gameState.matsuri.mp;

        updateBar(this.gameState.matsuri.hp, this.gameState.matsuri.maxHp, 'matsuri-hp-bar');
        updateBar(this.gameState.matsuri.mp, this.gameState.matsuri.maxMp, 'matsuri-mp-bar');
    }

    handleInitializationError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'ゲームの初期化に失敗しました。ページを更新してください。';
        document.body.appendChild(errorMessage);
    }

    resetGame() {
        location.reload();
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
