// game.js
document.addEventListener('DOMContentLoaded', function() {
    // デバッグ用のログ
    console.log('Game starting...');

    // 画面要素の取得
    const titleScreen = document.getElementById('title-screen');
    const storyScreen = document.getElementById('story-screen');
    const storyText = document.getElementById('story-text');
    const nextButton = document.getElementById('next-button');

    // ストーリーの設定
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
    titleScreen.onclick = function() {
        console.log('Title clicked');
        titleScreen.style.display = 'none';
        storyScreen.style.display = 'block';
        updateStoryText();
    };

    // Nextボタンのクリックイベント
    nextButton.onclick = function() {
        console.log('Next clicked');
        currentStoryIndex++;
        if (currentStoryIndex < storySequence.length) {
            updateStoryText();
        } else {
            startBattle();
        }
    };

    // ストーリーテキストの更新
    function updateStoryText() {
        console.log('Updating story:', currentStoryIndex);
        storyText.textContent = storySequence[currentStoryIndex];
    }

    // 戦闘画面への移行
    function startBattle() {
        console.log('Starting battle');
        storyScreen.style.display = 'none';
        document.getElementById('battle-screen').style.display = 'block';
    }

    // 初期状態の設定
    storyScreen.style.display = 'none';
    document.getElementById('battle-screen').style.display = 'none';
});
