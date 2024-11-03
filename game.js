// game.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game initializing...');

    // タイトル画面の処理
    const titleScreen = document.getElementById('title-screen');
    const storyScreen = document.getElementById('story-screen');
    const storyText = document.getElementById('story-text');
    const nextButton = document.getElementById('next-button');

    let currentStoryIndex = 0;
    const storySequence = [
        "MATSURIは男を追い詰めた",
        "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
        "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
        "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
        "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
        "MATSURIは危険を感じた。この男は一体。",
        "戦闘を開始します。"
    ];

    // タイトル画面のクリックイベント
    titleScreen.addEventListener('click', startGame);
    titleScreen.addEventListener('touchend', function(e) {
        e.preventDefault();
        startGame();
    });

    // Nextボタンのクリックイベント
    nextButton.addEventListener('click', nextStory);
    nextButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        nextStory();
    });

    function startGame() {
        console.log('Starting game...');
        titleScreen.classList.add('hidden');
        storyScreen.classList.remove('hidden');
        updateStoryText();
    }

    function nextStory() {
        console.log('Next story...');
        currentStoryIndex++;
        if (currentStoryIndex < storySequence.length) {
            updateStoryText();
        } else {
            startBattle();
        }
    }

    function updateStoryText() {
        console.log('Updating story text:', currentStoryIndex);
        storyText.textContent = storySequence[currentStoryIndex];
    }

    function startBattle() {
        console.log('Starting battle...');
        storyScreen.classList.add('hidden');
        document.getElementById('battle-screen').classList.remove('hidden');
    }
});
