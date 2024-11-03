// game.js
class YumeAiFantasy {
    constructor() {
        // DOMが完全に読み込まれてから初期化
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeGame();
        });
    }

    initializeGame() {
        // 要素の存在確認を追加
        const loadingScreen = document.getElementById('loading-screen');
        const titleScreen = document.getElementById('title-screen');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (titleScreen) {
            titleScreen.classList.remove('hidden');
        }

        this.gameState = {
            currentScene: 'title',
            // 他の初期設定
        };

        this.bindEvents();
    }

    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    // 他のメソッド
}

// ゲーム開始
window.onload = () => {
    window.game = new YumeAiFantasy();
};
