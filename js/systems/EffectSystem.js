// EffectSystem.js
class EffectSystem {
    constructor(game) {
        this.game = game;
        this.container = this.createEffectContainer();
        this.isEnabled = true;
    }

    createEffectContainer() {
        const container = document.createElement('div');
        container.id = 'effect-container';
        document.body.appendChild(container);
        return container;
    }

    async playEffect(type, options = {}) {
        if (!this.isEnabled) return;

        switch (type) {
            case 'attack':
                await this.playAttackEffect();
                break;
            case 'magic':
                await this.playMagicEffect();
                break;
            case 'darkCommunion':
                await this.playDarkCommunionEffect();
                break;
            case 'damage':
                await this.showDamageNumber(options.damage, options.x, options.y);
                break;
        }
    }

    // フラッシュエフェクト
    async playFlash(color = '#fff', duration = 200) {
        const flash = document.createElement('div');
        flash.className = 'flash-effect';
        flash.style.backgroundColor = color;
        this.container.appendChild(flash);

        // フェードイン
        await this.wait(50);
        flash.style.opacity = '0.7';

        // 持続時間
        await this.wait(duration);

        // フェードアウト
        flash.style.opacity = '0';
        await this.wait(300);

        flash.remove();
    }

    // 振動エフェクト
    async playShake(duration = 400) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('shake');
        await this.wait(duration);
        gameContainer.classList.remove('shake');
    }

    // パーティクルエフェクト
    createParticles(count = 20, color = '#fff', options = {}) {
        const defaults = {
            size: 3,
            duration: 800,
            distance: 100,
            spread: 360,
            originX: window.innerWidth / 2,
            originY: window.innerHeight / 2
        };

        const settings = { ...defaults, ...options };

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // パーティクルのスタイル設定
            particle.style.cssText = `
                position: absolute;
                width: ${settings.size}px;
                height: ${settings.size}px;
                background-color: ${color};
                border-radius: 50%;
                pointer-events: none;
                left: ${settings.originX}px;
                top: ${settings.originY}px;
            `;

            this.container.appendChild(particle);

            // パーティクルのアニメーション
            const angle = (Math.random() * settings.spread) * Math.PI / 180;
            const velocity = 2 + Math.random() * 2;
            const moveX = Math.cos(angle) * settings.distance;
            const moveY = Math.sin(angle) * settings.distance;

            particle.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${moveX}px, ${moveY}px)`, opacity: 0 }
            ], {
                duration: settings.duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // ダメージ数値表示
    async showDamageNumber(damage, x, y) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-number';
        damageText.textContent = damage;
        damageText.style.left = `${x}px`;
        damageText.style.top = `${y}px`;

        this.container.appendChild(damageText);

        await this.wait(1000);
        damageText.remove();
    }

    // 攻撃エフェクト
    async playAttackEffect() {
        await Promise.all([
            this.playFlash('#fff', 200),
            this.playShake(400)
        ]);
    }

    // 魔法エフェクト
    async playMagicEffect() {
        await this.playFlash('#4444ff', 300);
        this.createParticles(20, '#66f', {
            size: 4,
            duration: 1000,
            distance: 150
        });
    }

    // 黒の聖餐エフェクト
    async playDarkCommunionEffect() {
        await this.playFlash('#800080', 500);
        this.createParticles(30, '#800080', {
            size: 5,
            duration: 1500,
            distance: 200
        });
        await this.playShake(800);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
}
