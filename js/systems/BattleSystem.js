// BattleSystem.js
class BattleSystem {
    constructor(game) {
        this.game = game;
        this.state = {
            isPlayerTurn: true,
            battleCount: 0,
            darkCommunionAvailable: false,
            lastAction: null
        };
    }

    async handleCommand(command) {
        if (!this.state.isPlayerTurn) return;

        switch (command) {
            case 'attack':
                await this.executeAttack();
                break;
            case 'magic':
                await this.executeMagic();
                break;
            case 'talk':
                await this.executeTalk();
                break;
            case 'escape':
                this.executeEscape();
                break;
        }

        this.state.battleCount++;
        if (this.state.battleCount >= 30) {
            this.game.gameOver();
            return;
        }

        if (!this.checkGameEnd()) {
            await this.executeEnemyTurn();
        }
    }

    async executeAttack() {
        const damage = Math.floor(Math.random() * 20) + 40;
        await this.dealDamage('unknown', damage);
        await this.game.effectSystem.playEffect('attack');
        this.state.lastAction = 'attack';
    }

    async executeMagic() {
        if (this.game.gameState.matsuri.mp >= 15) {
            const damage = Math.floor(Math.random() * 200) + 100;
            this.game.gameState.matsuri.mp -= 15;
            await this.dealDamage('unknown', damage);
            await this.game.effectSystem.playEffect('magic');
            this.state.lastAction = 'magic';
            this.game.updateStatus();
        }
    }

    async executeTalk() {
        this.state.battleCount++;
        if (this.checkDarkCommunionCondition()) {
            this.state.darkCommunionAvailable = true;
            await this.executeDarkCommunion();
        }
        this.state.lastAction = 'talk';
    }

    executeEscape() {
        this.game.gameOver();
    }

    async dealDamage(target, amount) {
        const targetChar = this.game.gameState[target];
        targetChar.hp = Math.max(0, targetChar.hp - amount);
        await this.game.effectSystem.showDamageNumber(amount);
        this.game.updateStatus();
    }

    checkDarkCommunionCondition() {
        return this.game.gameState.unknown.hp <= 1000 && Math.random() < 0.3;
    }

    async executeDarkCommunion() {
        const damage = this.game.gameState.unknown.hp;
        this.game.gameState.darkCommunionInspired = true;
        await this.dealDamage('unknown', damage);
        await this.game.effectSystem.playDarkCommunionEffect();
        this.state.lastAction = 'darkCommunion';
    }

    async executeEnemyTurn() {
        this.state.isPlayerTurn = false;
        
        // 敵の行動選択
        const actions = ['attack', 'magic'];
        const enemyAction = actions[Math.floor(Math.random() * actions.length)];
        
        // 敵の行動実行
        if (enemyAction === 'attack') {
            const damage = Math.floor(Math.random() * 15) + 30;
            await this.dealDamage('matsuri', damage);
            await this.game.effectSystem.playEffect('enemyAttack');
        } else {
            const damage = Math.floor(Math.random() * 100) + 50;
            await this.dealDamage('matsuri', damage);
            await this.game.effectSystem.playEffect('enemyMagic');
        }

        this.state.isPlayerTurn = true;
    }

    checkGameEnd() {
        if (this.game.gameState.matsuri.hp <= 0) {
            this.game.gameOver();
            return true;
        }
        if (this.game.gameState.unknown.hp <= 0) {
            this.game.showEnding();
            return true;
        }
        return false;
    }

    initializeBattle() {
        this.state = {
            isPlayerTurn: true,
            battleCount: 0,
            darkCommunionAvailable: false,
            lastAction: null
        };
        this.game.updateStatus();
    }
}
