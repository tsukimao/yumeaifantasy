// StorySystem.js
class StorySystem {
    constructor(game) {
        this.game = game;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.storySequence = [
            "MATSURIは男を追い詰めた",
            "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
            "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
            "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
            "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
            "MATSURIは危険を感じた。この男は一体。",
            "戦闘を開始します。"
        ];

        this.endingSequence = [
            "永き夜の終わりに、一筋の光が差し込む。",
            "幾百年もの間、永遠の命という呪いに縛られ続けた魂が、今、解放の時を迎えようとしていた。",
            "黒の聖餐――それは、人の世の理から外れた存在を、本来あるべき姿へと導く禁忌の魔法。",
            "MATSURIの詠唱が終わりに近づくにつれ、UNKNOWNの姿は淡い光に包まれていく。",
            "「ありがとう...」",
            "永遠の命という重荷から解放された魂は、新たな夜明けとともに生まれ変わることだろう。"
        ];
    }

    async start() {
        this.isPlaying = true;
        this.currentIndex = 0;
        this.game.changeScene('story');
        await this.showNextText();
    }

    async showNextText() {
        if (!this.isPlaying) return;

        if (this.currentIndex >= this.storySequence.length) {
            this.complete();
            return;
        }

        const text = this.storySequence[this.currentIndex];
        await this.displayText(text);
        this.currentIndex++;
    }

    async displayText(text) {
        const textElement = document.getElementById('story-text');
        const nextButton = document.getElementById('next-button');

        // テキストフェードアウト
        textElement.style.opacity = '0';
        await this.wait(300);

        // テキスト更新
        textElement.textContent = text;

        // テキストフェードイン
        textElement.style.opacity = '1';
        
        // ボタンイベントの設定
        return new Promise(resolve => {
            const clickHandler = () => {
                nextButton.removeEventListener('click', clickHandler);
                resolve();
            };
            nextButton.addEventListener('click', clickHandler);
        });
    }

    async showEndingSequence() {
        this.game.changeScene('ending');
        const endingText = document.getElementById('ending-text');

        for (const text of this.endingSequence) {
            endingText.style.opacity = '0';
            await this.wait(300);
            endingText.textContent = text;
            endingText.style.opacity = '1';
            await this.wait(4000);
        }

        await this.showFinalMessage();
        this.showEndingButtons();
    }

    async showFinalMessage() {
        const endingText = document.getElementById('ending-text');
        endingText.innerHTML = `
            永遠の闇から解放された魂は、<br>
            新たな夜明けとともに生まれ変わる。<br><br>
            そして物語は、新たな冒険の序章となる。
        `;
    }

    showEndingButtons() {
        const buttons = document.createElement('div');
        buttons.id = 'ending-buttons';
        buttons.innerHTML = `
            <button id="retry-button">もういちど</button>
            <button id="hp-button">MATSURIの公式HPへ</button>
        `;

        document.getElementById('ending-screen').appendChild(buttons);

        document.getElementById('retry-button').onclick = () => {
            location.reload();
        };

        document.getElementById('hp-button').onclick = () => {
            window.location.href = 'https://reverieneon71.my.canva.site/';
        };
    }

    complete() {
        this.isPlaying = false;
        this.game.startBattle();
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
