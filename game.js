class Game {
    constructor() {
        this.init();
    }

    init() {
        this.gameState = {
            currentScene: 'title',
            player: {
                hp: 1000,
                maxHp: 1000,
                mp: 100,
                maxMp: 100
            },
            progress: 0,
            flags: new Set()
        };

        this.initializeElements();
        this.initializeEventListeners();
        this.loadSavedData();
        this.startLoadingScreen();
    }

    initializeElements() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            title: document.getElementById('title-screen'),
            main: document.getElementById('main-game')
        };
        
        this.storyText = document.querySelector('.story-text');
        this.battleContainer = document.querySelector('.battle-container');
    }

    initializeEventListeners() {
        document.querySelector('.start-button').addEventListener('click', () => this.startGame());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.progressStory();
        });
        
        document.addEventListener('click', () => this.progressStory());
        
        document.querySelectorAll('.battle-command').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleBattleCommand(e.target.dataset.command);
            });
        });
    }

    startLoadingScreen() {
        this.screens.loading.style.display = 'flex';
        setTimeout(() => {
            this.screens.loading.style.opacity = '0';
            setTimeout(() => {
                this.screens.loading.style.display = 'none';
                this.screens.title.style.display = 'flex';
            }, 500);
        }, 2000);
    }

    startGame() {
        this.screens.title.style.display = 'none';
        this.screens.main.classList.remove('hidden');
        this.startStory();
    }

    startStory() {
        const story = [
            "目覚めると、そこは見知らぬ場所だった。",
            "周りには誰もいない。",
            "ただ、かすかに聞こえる音楽の調べ...",
            "これは、夢なのだろうか？"
        ];
        
        this.storyQueue = [...story];
        this.progressStory();
    }

    progressStory() {
        if (!this.storyQueue || this.storyQueue.length === 0) return;
        
        const text = this.storyQueue.shift();
        this.showText(text);
        
        if (this.storyQueue.length === 0) {
            setTimeout(() => this.startBattle(), 2000);
        }
    }

    showText(text) {
        this.storyText.style.opacity = '0';
        setTimeout(() => {
            this.storyText.textContent = text;
            this.storyText.style.opacity = '1';
        }, 500);
    }

    startBattle() {
        this.battleContainer.classList.remove('hidden');
        this.showText("敵が現れた！");
    }

    handleBattleCommand(command) {
        switch(command) {
            case 'attack':
                this.performAttack();
                break;
            case 'magic':
                this.performMagic();
                break;
            case 'talk':
                this.performTalk();
                break;
            case 'escape':
                this.performEscape();
                break;
        }
    }

    performAttack() {
        this.showText("攻撃を繰り出した！");
        this.updateHp(-50);
    }

    performMagic() {
        if (this.gameState.player.mp >= 20) {
            this.showText("魔法を使った！");
            this.updateMp(-20);
            this.updateHp(-100);
        } else {
            this.showText("MPが足りない！");
        }
    }

    performTalk() {
        this.showText("話しかけてみた...");
        setTimeout(() => {
            this.showText("しかし反応がない。");
        }, 2000);
    }

    performEscape() {
        this.showText("逃げ出した！");
        setTimeout(() => {
            this.endBattle();
        }, 1500);
    }

    updateHp(amount) {
        this.gameState.player.hp = Math.max(0, Math.min(this.gameState.player.hp + amount, this.gameState.player.maxHp));
        document.getElementById('current-hp').textContent = this.gameState.player.hp;
        document.querySelector('.hp-bar div').style.width = `${(this.gameState.player.hp / this.gameState.player.maxHp) * 100}%`;
    }

    updateMp(amount) {
        this.gameState.player.mp = Math.max(0, Math.min(this.gameState.player.mp + amount, this.gameState.player.maxMp));
        document.getElementById('current-mp').textContent = this.gameState.player.mp;
        document.querySelector('.mp-bar div').style.width = `${(this.gameState.player.mp / this.gameState.player.maxMp) * 100}%`;
    }

    endBattle() {
        this.battleContainer.classList.add('hidden');
        this.startStory();
    }

    saveGame() {
        localStorage.setItem('gameState', JSON.stringify(this.gameState));
    }

    loadSavedData() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            this.gameState = JSON.parse(savedState);
            this.updateHp(0);
            this.updateMp(0);
        }
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
