// game.js - Part 1
window.onload = function() {
    console.log('Game initializing...'); // デバッグログ
    
    // ゲームの状態管理
    const gameState = {
        currentScene: 'title',
        storyIndex: 0,
        isAnimating: false,
        matsuri: {
            hp: 1000,
            mp: 100,
            maxHp: 1000,
            maxMp: 100
        },
        unknown: {
            hp: 2000,
            maxHp: 2000
        },
        battleCount: 0,
        darkCommunionInspired: false,
        isFinalPhase: false
    };

    // ストーリーテキスト
    const storySequence = [
        "MATSURIは男を追い詰めた",
        "UNKNOWN: 『私はかつて人間だった。だが、運命は私を吸血鬼へと変えた。』",
        "UNKNOWN: 『伝説では、吸血鬼は十字架や聖水に弱いとされている。しかし、それは迷信だ。』",
        "UNKNOWN: 『私は何百年も生きてきた。だが、その長い年月は孤独と寂寥に満ちていた。』",
        "UNKNOWN: 『吸血鬼は永遠の命を持つ。だが、その代償として愛する者への苦しみを知る。』",
        "MATSURIは危険を感じた。この男は一体。",
        "戦闘を開始します。"
    ];

    // 戦闘時の台詞
    const unknownBattleDialogues = [
        "永遠の命は祝福ではなく、呪いだ。愛する者たちの死を何度も見続ける運命なのだから",
        "時は流れ続け、私だけが取り残される。それが吸血鬼の宿命だ",
        "月明かりの下で何百年も生きてきた。だが、心の渇きは癒えることはない",
        "私の心臓は止まったまま。それでも、記憶だけは生き続ける",
        "永遠の時を生きることは、永遠に別れを繰り返すこと",
        "人間たちは私を怪物と呼ぶ。だが、彼らこそが時に最も残酷な存在だ",
        "血を求める渇きは永遠に続く。それでも、人間の命の尊さを忘れたことはない",
        "かつて人間だった記憶が薄れていく。それでも、人間の温もりだけは忘れられない",
        "人間の血は私の命の源。しかし、それは同時に最大の罪",
        "人間の世界で生きながら、決して人間になれない。これほどの皮肉があろうか",
        "太陽は私の敵。だが、夜の闇は最高の同志だ",
        "影の中でこそ、私たちは真の姿を見せる",
        "月の光に照らされる時、私は最も美しく、そして最も危険な存在となる",
        "夜の帳が下りる時、私の真の生が始まる",
        "闇は私の母であり、月は私の父",
        "人から吸血鬼への変容は、千の針で心を刺すような痛みだった",
        "最初の血の味を忘れない。あの瞬間、私は人間性を失った",
        "変貌の夜、私は人としての全てを失い、永遠の命を得た",
        "人間の姿を保っているが、内なる獣は常に血を求めている",
        "変身の痛みは永遠に続く。それは私の罪の印"
    ];
        // 会話時の台詞
    const unknownTalkDialogues = [
        "世紀を超えて生きる者には、記憶が重荷となる",
        "私の記憶は古い図書館のよう。数え切れない物語で満ちている",
        "時代は移り変わる。だが、私の姿だけは永遠に変わらない",
        "何百年もの記憶が重なり、時には自分が誰だったのかも分からなくなる",
        "過去の記憶は私を苦しめる。しかし、それは私の一部",
        "不死の力を持つことは、永遠の責任を負うこと",
        "私の力は呪いであり、同時に祝福でもある",
        "人間より強く、神より弱い。それが私たちの定め",
        "力を持つことは、常に選択を迫られること",
        "私の力は増すが、それと共に孤独も深まる",
        "愛する者との別れは、永遠の命の中で最も辛い試練",
        "人を愛することは許されない。それでも、心は愛を求める",
        "永遠の命は、永遠の別れの連続",
        "愛は私にとって最も危険な感情。それでも、抗うことはできない",
        "愛する者の死を見届けること。それが私の永遠の宿命",
        "この運命は選んだわけではない。だが、受け入れるしかなかった",
        "運命の糸は血で染まっている。それが私の道",
        "選択の自由はあっても、人間に戻る自由はない",
        "運命は私を吸血鬼にした。しかし、私の行動は私が選ぶ",
        "永遠の命は与えられた。だが、その使い方は私次第",
        "誰も私の真の姿を知らない。それが吸血鬼の宿命だ",
        "永遠の命を持つ者には、永遠の孤独が付きまとう",
        "夜ごと街を彷徨う。だが、帰るべき場所はどこにもない",
        "孤独は私の永遠の伴侶。最も忠実で、最も残酷な",
        "世界は変わり続ける。だが、私の孤独だけは変わらない",
        "永遠の闇の中にも、時として希望の光は見える",
        "絶望の底で見つけた希望。それが私を支える",
        "永遠の命は、新たな可能性への扉でもある",
        "夜明けは来ない。しかし、それは必ずしも絶望を意味しない",
        "永遠の命を持つ者にも、変化の可能性はある。それが私の希望"
    ];

    // 黒の聖餐イベントのテキスト
    const darkCommunionEvent = [
        "MATSURIは禁忌の魔法を思い出した...",
        "黒き聖餐よ、我が魂を捧げる...",
        "全てを終わらせる時が来た。"
    ];

    // ユーティリティ関数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showElement(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    function hideElement(id) {
        document.getElementById(id).classList.add('hidden');
    }

    async function showMessage(text) {
        const messageText = document.getElementById('message-text');
        messageText.style.opacity = '0';
        await wait(300);
        messageText.textContent = text;
        messageText.style.opacity = '1';
    }

    // イベントハンドラ
    document.getElementById('title-screen').onclick = async function() {
        console.log('Title screen clicked'); // デバッグログ
        hideElement('title-screen');
        showElement('story-screen');
        gameState.currentScene = 'story';
        document.getElementById('story-text').textContent = storySequence[0];
    };

    document.getElementById('next-button').onclick = async function() {
        if (gameState.isAnimating) return;
        console.log('Next button clicked'); // デバッグログ

        gameState.storyIndex++;
        if (gameState.storyIndex < storySequence.length) {
            const storyText = document.getElementById('story-text');
            storyText.style.opacity = '0';
            await wait(300);
            storyText.textContent = storySequence[gameState.storyIndex];
            storyText.style.opacity = '1';
        } else {
            startBattle();
        }
    };
        // 戦闘関連の関数
    function startBattle() {
        hideElement('story-screen');
        showElement('battle-screen');
        gameState.currentScene = 'battle';
        updateStatus();
        showMessage("コマンドを選択してください。");
    }

    async function handleAttack() {
        if (gameState.isAnimating) return;
        
        gameState.battleCount++;
        gameState.isAnimating = true;
        const damage = Math.floor(Math.random() * 20) + 40;
        
        await showAttackAnimation('matsuri');
        showDamageText(damage);
        await applyDamage(damage);

        if (gameState.battleCount >= 30) {
            await showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        await showBattleMessage();
        gameState.isAnimating = false;
        checkBattleStatus();
    }

    async function handleMagic() {
        if (gameState.isAnimating || gameState.matsuri.mp < 15) {
            if (gameState.matsuri.mp < 15) {
                showMessage("MPが足りません！");
            }
            return;
        }

        gameState.battleCount++;
        gameState.isAnimating = true;
        let damage;

        if (gameState.darkCommunionInspired) {
            damage = gameState.unknown.hp;
            await executeDarkCommunion();
        } else {
            damage = Math.floor(Math.random() * 200) + 100;
            gameState.matsuri.mp -= 15;
            await showMagicAnimation('matsuri');
        }

        showDamageText(damage);
        await applyDamage(damage);

        if (gameState.battleCount >= 30) {
            await showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        if (gameState.darkCommunionInspired) {
            await showSpecialEnding();
        } else {
            await showBattleMessage();
            gameState.isAnimating = false;
            checkBattleStatus();
        }
    }

    async function handleTalk() {
        if (gameState.isAnimating) return;
        
        gameState.battleCount++;
        
        if (gameState.battleCount >= 30) {
            await showMessage("UNKNOWN: 『もう十分だ。お前の血を頂こう...』");
            showGameOver("MATSURIは吸血鬼にされました");
            return;
        }

        if (gameState.isFinalPhase) {
            await showMessage("ただの会話ではこの男を倒せないようだ...");
        } else {
            await showTalkMessage();
        }
        checkBattleStatus();
    }

    function handleEscape() {
        showGameOver("MATSURIは吸血鬼にされました");
    }

    // 戦闘画面のアニメーションと効果
    async function showAttackAnimation(character) {
        const container = document.getElementById(`${character}-container`);
        container.classList.add('attack-animation');
        await wait(500);
        container.classList.remove('attack-animation');
    }

    async function showMagicAnimation(character) {
        const effectLayer = document.getElementById('effect-layer');
        const effect = document.createElement('img');
        effect.src = `https://tsukimao.github.io/yumeaifantasy/${character}.mahou.gif`;
        effect.className = 'magic-effect';
        
        effectLayer.appendChild(effect);
        await wait(1000);
        effect.remove();
    }

    function showDamageText(damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = damage;
        
        const unknown = document.getElementById('unknown-container');
        const rect = unknown.getBoundingClientRect();
        
        damageText.style.left = `${rect.left + rect.width / 2}px`;
        damageText.style.top = `${rect.top + rect.height / 2}px`;
        
        document.body.appendChild(damageText);
        setTimeout(() => damageText.remove(), 1000);
    }
        // 戦闘状態の管理
    async function applyDamage(damage) {
        gameState.unknown.hp = Math.max(0, gameState.unknown.hp - damage);
        updateStatus();
        await wait(500);
    }

    async function showBattleMessage() {
        const message = unknownBattleDialogues[
            Math.floor(Math.random() * unknownBattleDialogues.length)
        ];
        await showMessage(`UNKNOWN: 『${message}』`);
    }

    async function showTalkMessage() {
        const message = unknownTalkDialogues[
            Math.floor(Math.random() * unknownTalkDialogues.length)
        ];
        await showMessage(`UNKNOWN: 『${message}』`);
    }

    async function checkBattleStatus() {
        if (gameState.unknown.hp <= 300 && !gameState.isFinalPhase) {
            await executeFinalPhase();
        } else if (gameState.unknown.hp <= 1000 && !gameState.darkCommunionInspired) {
            await inspireDarkCommunion();
        }
        updateStatus();
    }

    async function executeFinalPhase() {
        gameState.isFinalPhase = true;
        await showMagicAnimation('boss');
        gameState.matsuri.hp = 1;
        await showMessage("UNKNOWNの最後の攻撃！MATSURIのHPが1になった！");
        await showMessage("ただの攻撃ではこの男を倒せないようだ...");
        document.getElementById('attack').disabled = true;
        document.getElementById('magic').disabled = true;
    }

    async function inspireDarkCommunion() {
        gameState.darkCommunionInspired = true;
        await showMessage("MATSURIは何かを思い出しそうになった...");
        await showMessage("「黒の聖餐」という言葉が頭をよぎる...");
        document.getElementById('magic').textContent = "黒の聖餐";
        document.getElementById('magic').classList.add('special-skill');
    }

    async function executeDarkCommunion() {
        for (const text of darkCommunionEvent) {
            await showMessage(text);
            await wait(1000);
        }

        const flashLayer = document.getElementById('flash-layer');
        flashLayer.classList.remove('hidden');
        flashLayer.classList.add('flash');
        await showMagicAnimation('matsuri');
        await wait(1000);
        flashLayer.classList.remove('flash');
        flashLayer.classList.add('hidden');
    }

    async function showSpecialEnding() {
        await showMessage("黒の聖餐の力が解き放たれた！");
        await showMessage("UNKNOWNの姿が光に包まれていく...");
        await showMessage("UNKNOWN: 『ありがとう...やっと解放される...』");
        
        hideElement('battle-screen');
        showElement('ending-screen');
        
        document.getElementById('ending-title').textContent = "TRUE END";
        document.getElementById('ending-message').textContent = 
            "MATSURIは吸血鬼の呪いを解き、新たな冒険へと旅立つ...";
        
        showElement('ending-choices');
    }

    function showGameOver(message) {
        hideElement('battle-screen');
        showElement('gameover-screen');
        document.getElementById('gameover-message').textContent = message;
    }

    function updateStatus() {
        const updateBar = (current, max, barId) => {
            const bar = document.getElementById(barId);
            const percentage = (current / max) * 100;
            bar.style.width = `${percentage}%`;
        };

        document.getElementById('matsuri-hp').textContent = gameState.matsuri.hp;
        document.getElementById('matsuri-mp').textContent = gameState.matsuri.mp;

        updateBar(gameState.matsuri.hp, gameState.matsuri.maxHp, 'matsuri-hp-bar');
        updateBar(gameState.matsuri.mp, gameState.matsuri.maxMp, 'matsuri-mp-bar');
    }

    // 戦闘コマンドのイベントリスナー設定
    document.getElementById('attack').onclick = handleAttack;
    document.getElementById('magic').onclick = handleMagic;
    document.getElementById('talk').onclick = handleTalk;
    document.getElementById('escape').onclick = handleEscape;
    document.getElementById('retry').onclick = () => location.reload();
    document.getElementById('retry-gameover').onclick = () => location.reload();
};
