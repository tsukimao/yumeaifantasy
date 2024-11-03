class YumeAiFantasy {
    constructor() {
        this.animationFrame = null;
        this.initializeGame();
        this.bindEvents();
        this.setupEffectSystem();
    }

    initializeGame() {
        console.log('Initializing game...');
        
        // ローディング画面を表示
        document.getElementById('loading-screen').style.display = 'flex';
        
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

        // アセットのプリロード
        this.preloadAssets().then(() => {
            // ローディング画面を非表示
            document.getElementById('loading-screen').style.display = 'none';
        });

        // エフェクトシステムの初期化
        this.effectSystem = {
            particles: [],
            maxParticles: 100
        };
    }

    // アセットのプリロード
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
            console.error('Asset loading failed:', error);
        }
    }

    // エフェクトシステムのセットアップ
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
        // イベントのバインド
    bindEvents() {
        // 既存のイベントリスナーを削除
        const removeOldListeners = (element, events) => {
            if (element) {
                events.forEach(event => {
                    element.replaceWith(element.cloneNode(true));
                });
            }
        };

        // 各要素のイベントリスナーを更新
        ['click', 'touchend'].forEach(event => {
            removeOldListeners(document.getElementById('title-screen'), [event]);
            removeOldListeners(document.getElementById('next-button'), [event]);
        });

        // タイトル画面
        document.getElementById('title-screen').addEventListener('click', () => {
            console.log('Title screen clicked');
            this.playEffect('FLASH');
            this.hideElement('title-screen');
            this.showElement('story-screen');
            this.gameState.currentScene = 'story';
            this.updateStory();
        });

        // ストーリー進行
        document.getElementById('next-button').addEventListener('click', async () => {
            if (this.gameState.isAnimating) return;
            console.log('Next button clicked');
            
            this.gameState.storyIndex++;
            if (this.gameState.storyIndex < this.storySequence.length) {
                await this.updateStory();
            } else {
                this.startBattle();
            }
        });

        // 戦闘コマンド
        document.getElementById('attack').addEventListener('click', () => this.handleAttack());
        document.getElementById('magic').addEventListener('click', () => this.handleMagic());
        document.getElementById('talk').addEventListener('click', () => this.handleTalk());
        document.getElementById('escape').addEventListener('click', () => this.handleEscape());

        // エンディング画面のボタン
        document.getElementById('retry-ending').addEventListener('click', () => {
            this.playEffect('FLASH');
            setTimeout(() => this.resetGame(), 300);
        });

        document.getElementById('visit-site').addEventListener('click', () => {
            window.location.href = 'https://reverieneon71.my.canva.site/';
        });

        // ゲームオーバー画面のリトライ
        document.getElementById('retry-gameover').addEventListener('click', () => {
            this.playEffect('FLASH');
            setTimeout(() => this.resetGame(), 300);
        });

        // タッチデバイス対応
        const addTouchEvents = (element) => {
            if (!element) return;
            
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                element.classList.add('touched');
            });
            
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                element.classList.remove('touched');
                element.click();
            });
        };

        // 全てのボタンにタッチイベントを追加
        document.querySelectorAll('button').forEach(addTouchEvents);
        addTouchEvents(document.getElementById('title-screen'));
    }

    // エフェクト再生
    playEffect(effectType, options = {}) {
        const effect = this.effectTypes[effectType];
        if (effect) {
            effect.create(options);
        }
    }

    // 複数エフェクトの同時再生
    async playEffects(effects) {
        const promises = effects.map(effect => {
            return new Promise(resolve => {
                this.playEffect(effect.type, effect.options);
                setTimeout(resolve, this.effectTypes[effect.type].duration);
            });
        });
        await Promise.all(promises);
    }

    // パーティクル生成
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
        // 戦闘コマンド処理
    async handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        // 攻撃エフェクトシーケンス
        await this.playEffects([
            { type: 'FLASH' },
            { type: 'SHAKE' }
        ]);
        
        const container = document.getElementById('matsuri-container');
        container.classList.add('attacking');
        await this.wait(500);
        container.classList.remove('attacking');

        // ダメージ処理
        const unknownElement = document.getElementById('unknown-container');
        unknownElement.classList.add('damaged');
        this.showDamageText(damage);
        this.createParticles(
            unknownElement.offsetLeft + unknownElement.offsetWidth / 2,
            unknownElement.offsetTop + unknownElement.offsetHeight / 2,
            10,
            { color: '#ff0000' }
        );
        
        await this.applyDamage(damage);
        unknownElement.classList.remove('damaged');

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
            await this.executeMagicAttack();
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

    // 通常魔法攻撃
    async executeMagicAttack() {
        const matsuriElement = document.getElementById('matsuri-container');
        const unknownElement = document.getElementById('unknown-container');

        // 魔法陣エフェクト
        const magicCircle = document.createElement('div');
        magicCircle.className = 'magic-circle-effect';
        matsuriElement.appendChild(magicCircle);

        await this.playEffects([
            { type: 'FLASH' },
            { type: 'PARTICLES', options: {
                x: unknownElement.offsetLeft + unknownElement.offsetWidth / 2,
                y: unknownElement.offsetTop + unknownElement.offsetHeight / 2,
                count: 20,
                color: '#00ffff'
            }}
        ]);

        await this.wait(1000);
        magicCircle.remove();
    }

    // 黒の聖餐の実行
    async executeDarkCommunion() {
        // 画面を暗く
        document.getElementById('battle-screen').classList.add('dark-communion-active');
        
        // 詠唱シーケンス
        const darkCommunionEffects = document.getElementById('dark-communion-effects');
        darkCommunionEffects.classList.remove('hidden');

        for (const text of this.darkCommunionEvent) {
            await this.showMessage(text);
            await this.wait(1500);
            
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
        // 戦闘コマンド処理
    async handleAttack() {
        if (this.gameState.isAnimating) return;
        
        this.gameState.battleCount++;
        this.gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        // 攻撃エフェクトシーケンス
        await this.playEffects([
            { type: 'FLASH' },
            { type: 'SHAKE' }
        ]);
        
        const container = document.getElementById('matsuri-container');
        container.classList.add('attacking');
        await this.wait(500);
        container.classList.remove('attacking');

        // ダメージ処理
        const unknownElement = document.getElementById('unknown-container');
        unknownElement.classList.add('damaged');
        this.showDamageText(damage);
        this.createParticles(
            unknownElement.offsetLeft + unknownElement.offsetWidth / 2,
            unknownElement.offsetTop + unknownElement.offsetHeight / 2,
            10,
            { color: '#ff0000' }
        );
        
        await this.applyDamage(damage);
        unknownElement.classList.remove('damaged');

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
            await this.executeMagicAttack();
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

    // 通常魔法攻撃
    async executeMagicAttack() {
        const matsuriElement = document.getElementById('matsuri-container');
        const unknownElement = document.getElementById('unknown-container');

        // 魔法陣エフェクト
        const magicCircle = document.createElement('div');
        magicCircle.className = 'magic-circle-effect';
        matsuriElement.appendChild(magicCircle);

        await this.playEffects([
            { type: 'FLASH' },
            { type: 'PARTICLES', options: {
                x: unknownElement.offsetLeft + unknownElement.offsetWidth / 2,
                y: unknownElement.offsetTop + unknownElement.offsetHeight / 2,
                count: 20,
                color: '#00ffff'
            }}
        ]);

        await this.wait(1000);
        magicCircle.remove();
    }

    // 黒の聖餐の実行
    async executeDarkCommunion() {
        // 画面を暗く
        document.getElementById('battle-screen').classList.add('dark-communion-active');
        
        // 詠唱シーケンス
        const darkCommunionEffects = document.getElementById('dark-communion-effects');
        darkCommunionEffects.classList.remove('hidden');

        for (const text of this.darkCommunionEvent) {
            await this.showMessage(text);
            await this.wait(1500);
            
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
        // エンディングシーケンスの実行
    async showSpecialEnding() {
        this.hideElement('battle-screen');
        this.showElement('ending-screen');
        
        const endingTitle = document.getElementById('ending-title');
        const endingStory = document.getElementById('ending-story');
        const endingMessage = document.getElementById('ending-message');
        const endingChoices = document.getElementById('ending-choices');

        endingTitle.textContent = "TRUE END";
        
        // エンディングストーリーの表示
        for (const text of this.endingStory) {
            endingStory.textContent = text;
            await this.wait(3000);
            await this.fadeOut(endingStory);
            await this.wait(500);
            await this.fadeIn(endingStory);
        }

        // 最終メッセージ
        endingMessage.innerHTML = 
            "永遠の闇から解放された魂は、<br>新たな夜明けとともに生まれ変わる。<br><br>" +
            "そして物語は、新たな冒険の序章となる。";
        
        await this.fadeIn(endingMessage);
        await this.wait(3000);

        // 選択肢の表示
        endingChoices.classList.remove('hidden');
        await this.fadeIn(endingChoices);

        // エンディング背景のパーティクルエフェクト
        this.startEndingParticles();
    }

    // エンディング用パーティクルエフェクト
    startEndingParticles() {
        const particleContainer = document.querySelector('.ending-particles');
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particleContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 5000);
        };

        setInterval(createParticle, 200);
    }

    // フェードイン効果
    async fadeIn(element) {
        element.style.opacity = '0';
        element.style.display = 'block';
        await this.animate(element, {
            opacity: [0, 1]
        }, {
            duration: 1000,
            easing: 'ease-in-out'
        });
    }

    // フェードアウト効果
    async fadeOut(element) {
        await this.animate(element, {
            opacity: [1, 0]
        }, {
            duration: 1000,
            easing: 'ease-in-out'
        });
        element.style.display = 'none';
    }

    // アニメーション実行
    animate(element, keyframes, options) {
        return new Promise(resolve => {
            const animation = element.animate(keyframes, options);
            animation.onfinish = resolve;
        });
    }

    // ゲームオーバー画面の表示
    showGameOver(message) {
        this.hideElement('battle-screen');
        this.showElement('gameover-screen');
        document.getElementById('gameover-message').textContent = message;
    }

    // ユーティリティ関数
    hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.remove('hidden');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ステータス更新
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

    // ゲームのリセット
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
