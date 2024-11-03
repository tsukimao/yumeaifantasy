// game.js
window.onload = function() {
    // デバッグ用
    console.log('Game loaded');

    // タイトル画面の処理
    var titleScreen = document.getElementById('title-screen');
    titleScreen.onclick = function() {
        console.log('Title clicked');
        alert('Title clicked'); // クリックの確認用
        titleScreen.style.display = 'none';
        document.getElementById('story-screen').style.display = 'block';
    };

    // ストーリー画面の処理
    var nextButton = document.getElementById('next-button');
    var storyText = document.getElementById('story-text');
    var currentIndex = 0;
    
    var stories = [
        "MATSURIは男を追い詰めた",
        "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
        "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』"
    ];

    // 最初のストーリーを表示
    storyText.textContent = stories[0];

    // Nextボタンの処理
    nextButton.onclick = function() {
        console.log('Next clicked');
        alert('Next clicked'); // クリックの確認用
        currentIndex++;
        if (currentIndex < stories.length) {
            storyText.textContent = stories[currentIndex];
        }
    };

    // 初期表示設定
    document.getElementById('story-screen').style.display = 'none';
};
