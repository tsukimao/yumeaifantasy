// ゲームの状態
let gameState = 'title';
let player = { hp: 100, mp: 50 };
let enemy = { hp: 100, name: 'UNKNOWN' };
let attackCount = 0;

// ゲーム開始
document.getElementById('startGame').addEventListener('click', () => {
    gameState = 'battle';
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    updateMessage('MATSURIはUNKNOWNに遭遇した！');
});

// コマンド選択
document.querySelectorAll('.command').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        switch (action) {
            case 'fight':
                fight();
                break;
            case 'magic':
                magic();
                break;
            case 'talk':
                talk();
                break;
            case 'escape':
                escape();
                break;
        }
    });
});

// ゲームクリア後の画面表示
const clearGame = () => {
    gameState = 'clear';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('clearScreen').style.display = 'flex';
};

// ゲームプレイの選択
document.getElementById('playAgain').addEventListener('click', () => {
    location.reload();
});
document.getElementById('goToOfficial').addEventListener('click', () => {
    window.location.href = 'https://reverieneon71.my.canva.site/';
});

// ゲームロジック
function fight() {
    enemy.hp -= 10;
    attackCount++;
    updateMessage(`MATSURIは${enemy.name}に10のダメージを与えた！`);
    if (attackCount >= 8) {
        clearGame();
        updateMessage('UNKNOWNは別の次元へとワープした。MATSURIはそれを無視して、豪華なクリア画面へと進んだ。');
    }
}

function magic() {
    if (player.mp >= 20) {
        enemy.hp -= 20;
        player.mp -= 20;
        attackCount++;
        updateMessage(`MATSURIは${enemy.name}に20の魔法ダメージを与えた！`);
        if (attackCount >= 8) {
            clearGame();
            updateMessage('UNKNOWNは別の次元へとワープした。MATSURIはそれを無視して、豪華なクリア画面へと進んだ。');
        }
    } else {
        updateMessage('MPが足りません！');
    }
}

function talk() {
    updateMessage(`MATSURIは${enemy.name}と話そうとしたが、無視された。`);
}

function escape() {
    updateMessage('逃げることに成功した！');
    clearGame();
    updateMessage('UNKNOWNは別の次元へとワープした。MATSURIはそれを無視して、豪華なクリア画面へと進んだ。');
}

// メッセージ更新
function updateMessage(message) {
    document.getElementById('messageWindow').innerText = message;
}

// ゲームループ
function gameLoop() {
    if (gameState === 'battle') {
        // 敵のターンなどの処理
    }
}

setInterval(gameLoop, 1000);
