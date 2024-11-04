// DebugSystem.js
class DebugSystem {
    constructor(game) {
        this.game = game;
        this.isDebugMode = false;
        this.debugPanel = null;
        this.debugLog = [];
        this.init();
    }

    init() {
        // デバッグモードの切り替え（Ctrl + Shift + D）
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDebugMode();
            }
        });
    }

    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        if (this.isDebugMode) {
            this.createDebugPanel();
        } else {
            this.removeDebugPanel();
        }
    }

    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.innerHTML = `
            <div class="debug-header">デバッグパネル</div>
            <div class="debug-content">
                <div class="debug-section">
                    <h3>ゲーム状態</h3>
                    <div class="debug-status"></div>
                </div>
                <div class="debug-section">
                    <h3>コマンド</h3>
                    <button onclick="game.debugSystem.setHP('matsuri', 1000)">HP全回復</button>
                    <button onclick="game.debugSystem.setMP('matsuri', 100)">MP全回復</button>
                    <button onclick="game.debugSystem.setHP('unknown', 1)">敵HP1</button>
                    <button onclick="game.debugSystem.forceDarkCommunion()">黒の聖餐強制発動</button>
                </div>
                <div class="debug-section">
                    <h3>シーン制御</h3>
                    <button onclick="game.debugSystem.changeScene('title')">タイトルへ</button>
                    <button onclick="game.debugSystem.changeScene('story')">ストーリーへ</button>
                    <button onclick="game.debugSystem.changeScene('battle')">戦闘へ</button>
                    <button onclick="game.debugSystem.changeScene('ending')">エンディングへ</button>
                </div>
                <div class="debug-section">
                    <h3>ログ</h3>
                    <div class="debug-log"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.debugPanel);
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            if (!this.isDebugMode) return;

            const status = {
                scene: this.game.gameState.currentScene,
                matsuri: this.game.gameState.matsuri,
                unknown: this.game.gameState.unknown,
                battleCount: this.game.gameState.battleCount,
                darkCommunionInspired: this.game.gameState.darkCommunionInspired
            };

            const statusElement = this.debugPanel.querySelector('.debug-status');
            if (statusElement) {
                statusElement.textContent = JSON.stringify(status, null, 2);
            }
        }, 100);
    }

    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.debugLog.unshift(`[${timestamp}] ${message}`);
        if (this.debugLog.length > 50) {
            this.debugLog.pop();
        }

        const logElement = this.debugPanel?.querySelector('.debug-log');
        if (logElement) {
            logElement.innerHTML = this.debugLog.join('<br>');
        }
    }

    setHP(character, value) {
        this.game.gameState[character].hp = value;
        this.log(`${character}のHPを${value}に設定`);
        this.game.updateStatus();
    }

    setMP(character, value) {
        this.game.gameState[character].mp = value;
        this.log(`${character}のMPを${value}に設定`);
        this.game.updateStatus();
    }

    forceDarkCommunion() {
        this.game.gameState.darkCommunionInspired = true;
        this.log('黒の聖餐を強制発動');
        this.game.battleSystem.executeDarkCommunion();
    }

    changeScene(sceneName) {
        this.game.changeScene(sceneName);
        this.log(`シーンを${sceneName}に変更`);
    }

    removeDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.remove();
            this.debugPanel = null;
        }
    }
}
