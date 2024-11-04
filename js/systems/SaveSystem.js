// SaveSystem.js
class SaveSystem {
    constructor(game) {
        this.game = game;
        this.saveKey = 'YumeAiFantasy_SaveData';
        this.maxSaveSlots = 3;
    }

    saveGame(slotId = 0) {
        const saveData = {
            timestamp: new Date().toISOString(),
            gameState: {
                matsuri: { ...this.game.gameState.matsuri },
                unknown: { ...this.game.gameState.unknown },
                battleCount: this.game.gameState.battleCount,
                darkCommunionInspired: this.game.gameState.darkCommunionInspired,
                currentScene: this.game.gameState.currentScene
            },
            score: this.game.scoreSystem ? this.game.scoreSystem.score : 0
        };

        try {
            const allSaves = this.getAllSaves();
            allSaves[slotId] = saveData;
            localStorage.setItem(this.saveKey, JSON.stringify(allSaves));
            this.showMessage('セーブしました');
            return true;
        } catch (error) {
            console.error('セーブに失敗しました:', error);
            this.showMessage('セーブに失敗しました');
            return false;
        }
    }

    loadGame(slotId = 0) {
        try {
            const allSaves = this.getAllSaves();
            const saveData = allSaves[slotId];
            
            if (!saveData) {
                this.showMessage('セーブデータがありません');
                return false;
            }

            // ゲーム状態の復元
            this.game.gameState = {
                ...this.game.gameState,
                ...saveData.gameState
            };

            // スコアの復元
            if (this.game.scoreSystem && saveData.score) {
                this.game.scoreSystem.score = saveData.score;
            }

            this.game.changeScene(saveData.gameState.currentScene);
            this.showMessage('ロードしました');
            return true;
        } catch (error) {
            console.error('ロードに失敗しました:', error);
            this.showMessage('ロードに失敗しました');
            return false;
        }
    }

    getAllSaves() {
        const saves = localStorage.getItem(this.saveKey);
        return saves ? JSON.parse(saves) : Array(this.maxSaveSlots).fill(null);
    }

    deleteSave(slotId) {
        try {
            const allSaves = this.getAllSaves();
            allSaves[slotId] = null;
            localStorage.setItem(this.saveKey, JSON.stringify(allSaves));
            this.showMessage('セーブデータを削除しました');
            return true;
        } catch (error) {
            console.error('削除に失敗しました:', error);
            this.showMessage('削除に失敗しました');
            return false;
        }
    }

    showSaveMenu() {
        const saveMenu = document.createElement('div');
        saveMenu.id = 'save-menu';
        saveMenu.innerHTML = `
            <div class="save-menu-content">
                <h2>セーブ/ロード</h2>
                <div class="save-slots"></div>
                <button class="close-button">閉じる</button>
            </div>
        `;

        const slotsContainer = saveMenu.querySelector('.save-slots');
        const allSaves = this.getAllSaves();

        allSaves.forEach((save, index) => {
            const slot = document.createElement('div');
            slot.className = 'save-slot';
            
            if (save) {
                const date = new Date(save.timestamp);
                slot.innerHTML = `
                    <div class="save-info">
                        <div>スロット ${index + 1}</div>
                        <div>${date.toLocaleString()}</div>
                        <div>バトルカウント: ${save.gameState.battleCount}</div>
                    </div>
                    <div class="save-actions">
                        <button class="load-button">ロード</button>
                        <button class="save-button">上書き</button>
                        <button class="delete-button">削除</button>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="save-info">
                        <div>スロット ${index + 1}</div>
                        <div>空のスロット</div>
                    </div>
                    <div class="save-actions">
                        <button class="save-button">セーブ</button>
                    </div>
                `;
            }

            slotsContainer.appendChild(slot);
        });

        document.body.appendChild(saveMenu);
        this.addSaveMenuEventListeners(saveMenu);
    }

    addSaveMenuEventListeners(menu) {
        menu.querySelector('.close-button').onclick = () => {
            menu.remove();
        };

        menu.querySelectorAll('.save-slot').forEach((slot, index) => {
            const saveButton = slot.querySelector('.save-button');
            const loadButton = slot.querySelector('.load-button');
            const deleteButton = slot.querySelector('.delete-button');

            if (saveButton) {
                saveButton.onclick = () => {
                    this.saveGame(index);
                    menu.remove();
                };
            }

            if (loadButton) {
                loadButton.onclick = () => {
                    this.loadGame(index);
                    menu.remove();
                };
            }

            if (deleteButton) {
                deleteButton.onclick = () => {
                    if (confirm('本当に削除しますか？')) {
                        this.deleteSave(index);
                        menu.remove();
                    }
                };
            }
        });
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'save-message';
        message.textContent = text;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }
}
