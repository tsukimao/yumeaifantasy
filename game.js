let heroHP = 100;
let heroMP = 50;
let bossHP = 200;
let bossDamage = 0;
let gameState = 'title';
let storyIndex = 0;
let attackCount = 0;
let commandIndex = 0;

const storyParts = [
    "MATSURIはデジタルワールドの調査員。ある日、怪しい影を追いかけてUNKNOWNを探し始めました。",
    "彼は未知なる存在に引き寄せられるように、影を追って進みます。",
    "周囲に不気味な気配が漂っている。MATSURIは注意深く進む。",
    "UNKNOWNは薄暗い場所から出てきました。彼は恐ろしい目を持ち、MATSURIに向かって近づいてきます。",
    "MATSURIは彼を追いかけ、ついに真の姿を見せる。",
    "UNKNOWNは、人間の血を吸い、ゾンビに変えると噂される化け物です。",
    "最初は攻撃してきませんが、余裕を見せています。",
    "MATSURIは戦うか、話すか、魔法を使うか、逃げるかを賢く選ばなければなりません。",
    "MATSURIが戦うと、UNKNOWNの暗い過去と吸血鬼の話を聞かされます。",
    "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
    "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
    "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
    "MATSURIがダメージを与えると、UNKNOWNは嘘の吸血鬼話でMATSURIの血を吸おうとしてきます。",
    "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
    "MATSURIが吸血鬼の弱点を見出し、最後のコマンド選択で攻撃しようとしたところ、UNKNOWNは逃げました。"
];

const vampireStories = [
    // 吸血鬼の話をここに追加
];

function startGame() {
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('battleScreen').style.display = 'block';
    gameState = 'battle';
    displayStory();
    updateStatus();
    updateCommandAvailability();
}

function displayStory() {
    if (storyIndex < storyParts.length) {
        document.getElementById('story').innerHTML = storyParts[storyIndex];
        storyIndex++;
    }
    updateCommandAvailability();
}

function updateCommandAvailability() {
    let commandButtons = document.querySelectorAll('.command-button');
    if (commandIndex < 5) {
        commandButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
        if (commandIndex === 4) {
            commandButtons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '1';
            });
        }
    }
    commandIndex++;
}

function attack() {
    if (gameState === 'battle' && commandIndex >= 5) {
        document.getElementById('messages').innerHTML = 'MATSURI attacks UNKNOWN!<br>';
        bossHP -= 20;
        bossDamage += 20;
        attackCount++;
        if (bossDamage >= 100) {
            endGame();
        } else {
            let randomIndex = Math.floor(Math.random() * vampireStories.length);
            document.getElementById('messages').innerHTML += vampireStories[randomIndex] + '<br>';
            displayStory();
            bossAttack();
        }
        addFlashEffect();
        updateStatus();
    }
}

function castMagic() {
    if (gameState === 'battle' && heroMP >= 10 && commandIndex >= 5) {
        document.getElementById('messages').innerHTML = 'MATSURI casts magic!<br>';
        bossHP -= 40;
        bossDamage += 40;
        heroMP -= 10;
        if (bossDamage >= 100) {
            endGame();
        } else {
            let randomIndex = Math.floor(Math.random() * vampireStories.length);
            document.getElementById('messages').innerHTML += vampireStories[randomIndex] + '<br>';
            displayStory();
            bossAttack();
        }
        addFlashEffect();
        updateStatus();
    }
}

function talk() {
    if (gameState === 'battle' && commandIndex >= 5) {
        let randomIndex = Math.floor(Math.random() * vampireStories.length);
        document.getElementById('messages').innerHTML = vampireStories[randomIndex] + '<br>';
        displayStory();
    }
}

function runAway() {
    if (gameState === 'battle' && commandIndex >= 5) {
        document.getElementById('messages').innerHTML = 'MATSURI runs away!<br>';
        endGame();
    }
}

function updateStatus() {
    document.getElementById('heroHP').textContent = heroHP;
    document.getElementById('heroMP').textContent = heroMP;
}

function bossAttack() {
    if (gameState === 'battle') {
        document.getElementById('messages').innerHTML += 'UNKNOWN tries to suck MATSURI\'s blood!<br>';
        heroHP -= Math.floor(Math.random() * 20);
        if (heroHP <= 1) {
            endGame();
        }
        updateStatus();
    }
}

function endGame() {
    gameState = 'end';
    displayStory();
    document.getElementById('battleScreen').style.display = 'none';
    document.getElementById('clearScreen').style.display = 'flex';
    document.getElementById('clearMessage').innerHTML = createClearScreen();
}

function addFlashEffect() {
    document.body.classList.add('flash-effect');
    setTimeout(() => {
        document.body.classList.remove('flash-effect');
    }, 500);
}

function createClearScreen() {
    return 'ゲームクリア！🎉\n\n最終的にMATSURIはUNKNOWNを追い詰め、彼の邪悪な計画を阻止しました！\n仲間たちの元へ帰ることができたMATSURIは、再び平和な世界を取り戻しました。\nこの冒険を通じて、MATSURIは多くのことを学ぶことができました。';
}