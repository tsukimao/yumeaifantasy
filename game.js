// game.js
class YumeAiFantasy {
    constructor() {
        this.gameState = {
            currentScene: 'loading',
            storyIndex: 0,
            matsuri: { hp: 1000, mp: 100 },
            unknown: { hp: 2000 },
            battleCount: 0
        };
        
        this.storyTexts = [
            "MATSURIは男を追い詰めた",
            "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
            // ... 他のストーリーテキスト
        ];
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadAssets();
            this.bindEvents();
            this.showScene('title');
        } catch (error) {
            console.error('初期化エラー:', error);
            this.showError('ゲームの初期化に失敗しました。');
        }
    }
    
    async loadAssets() {
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
                img.onerror = () => reject(`Failed to load: ${asset}`);
                img.src = `assets/${asset}`;
            });
        });
        
        await Promise.all(promises);
    }
    
    showScene(sceneName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(`${sceneName}-screen`).style.display = 'block';
        this.gameState.currentScene = sceneName;
    }
    
    // 戦闘コマンド
    attack() {
        const damage = Math.floor(Math.random() * 20) + 40;
        this.gameState.unknown.hp -= damage;
        this.showEffect('flash');
        this.showDamage(damage);
        this.checkBattleEnd();
    }
    
    magic() {
        if (this.gameState.matsuri.mp >= 15) {
            const damage = Math.floor(Math.random() * 200) + 100;
            this.gameState.matsuri.mp -= 15;
            this.gameState.unknown.hp -= damage;
            this.showEffect('magic');
            this.showDamage(damage);
            this.updateStatus();
            this.checkBattleEnd();
        }
    }
    
    talk() {
        this.gameState.battleCount++;
        if (this.gameState.unknown.hp <= 1000 && Math.random() < 0.3) {
            this.activateDarkCommunion();
        }
        this.checkBattleCount();
    }
    
    escape() {
        this.gameOver();
    }
    
    // エフェクト
    showEffect(type) {
        const effect = document.createElement('div');
        effect.className = `effect ${type}`;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }
    
    showDamage(amount) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = amount;
        document.querySelector('.unknown').appendChild(damageText);
        setTimeout(() => damageText.remove(), 1000);
    }
    
    // ゲーム状態管理
    checkBattleEnd() {
        if (this.gameState.unknown.hp <= 0) {
            this.showEnding();
        }
    }
    
    checkBattleCount() {
        if (this.gameState.battleCount >= 30) {
            this.gameOver();
        }
    }
    
    updateStatus() {
        document.getElementById('hp').textContent = this.gameState.matsuri.hp;
        document.getElementById('mp').textContent = this.gameState.matsuri.mp;
    }
    
    // エンディング処理
    showEnding() {
        this.showScene('ending');
        this.playEndingSequence();
    }
    
    gameOver() {
        this.showScene('ending');
        document.getElementById('ending-text').textContent = 
            'MATSURIは吸血鬼にされました';
    }
    
    restart() {
        location.reload();
    }
    
    goToOfficial() {
        window.location.href = 'https://reverieneon71.my.canva.site/';
    }
}

// ゲーム開始
const game = new YumeAiFantasy();
