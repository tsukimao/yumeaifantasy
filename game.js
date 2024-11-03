// Main.java

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.Random;

public class Main extends JFrame {
    private JLabel hero, boss, heroHP, heroMP, messages, story;
    private JButton attack, talk, castMagic, runAway;

    private int heroHPValue = 100;
    private int heroMPValue = 50;
    private int bossHPValue = 200;
    private int bossDamageValue = 0;
    private int storyIndex = 0;
    private int attackCount = 0;
    private boolean isBattleStarted = false;

    private static final String[] storyParts = {
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
    };

    private static final String[] vampireStories = {
        // 吸血鬼の話をここに追加
    };

    public Main() {
        setLayout(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 600);
        setResizable(false);

        ImageIcon heroIcon = new ImageIcon("images/yumeaimatsuri.png");
        hero = new JLabel(heroIcon);
        hero.setBounds(650, 400, 100, 100);

        ImageIcon bossIcon = new ImageIcon("images/boss.png");
        boss = new JLabel(bossIcon);
        boss.setBounds(50, 400, 100, 100);

        heroHP = new JLabel("HP: " + heroHPValue);
        heroHP.setBounds(400, 500, 100, 20);

        heroMP = new JLabel("MP: " + heroMPValue);
        heroMP.setBounds(400, 520, 100, 20);

        messages = new JLabel();
        messages.setBounds(300, 300, 400, 100);
        messages.setVerticalAlignment(JLabel.TOP);

        story = new JLabel(storyParts[storyIndex]);
        story.setBounds(250, 20, 300, 100);
        story.setVerticalAlignment(JLabel.TOP);

        attack = new JButton("たたかう");
        attack.setBounds(10, 500, 100, 30);
        attack.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                attack();
            }
        });

        talk = new JButton("はなす");
        talk.setBounds(120, 500, 100, 30);
        talk.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                talk();
            }
        });

        castMagic = new JButton("まほう");
        castMagic.setBounds(230, 500, 100, 30);
        castMagic.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                castMagic();
            }
        });

        runAway = new JButton("にげる");
        runAway.setBounds(340, 500, 100, 30);
        runAway.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                runAway();
            }
        });

        add(hero);
        add(boss);
        add(heroHP);
        add(heroMP);
        add(messages);
        add(story);
        add(attack);
        add(talk);
        add(castMagic);
        add(runAway);

        setButtonsEnabled(false);
    }

    private void setButtonsEnabled(boolean enabled) {
        attack.setEnabled(enabled);
        talk.setEnabled(enabled);
        castMagic.setEnabled(enabled);
        runAway.setEnabled(enabled);
    }

    private void attack() {
        if (isBattleStarted) {
            bossHPValue -= 20;
            bossDamageValue += 20;
            attackCount++;
            if (bossDamageValue >= 100) {
                endGame();
            } else {
                displayStory();
                bossAttack();
            }
            addFlashEffect();
            updateStatus();
        }
    }

    private void castMagic() {
        if (isBattleStarted && heroMPValue >= 10) {
            bossHPValue -= 40;
            bossDamageValue += 40;
            heroMPValue -= 10;
            if (bossDamageValue >= 100) {
                endGame();
            } else {
                displayStory();
                bossAttack();
            }
            addFlashEffect();
            updateStatus();
        }
    }

    private void talk() {
        if (isBattleStarted) {
            int randomIndex = new Random().nextInt(vampireStories.length);
            messages.setText(vampireStories[randomIndex]);
            displayStory();
        }
    }

    private void runAway() {
        if (isBattleStarted) {
            messages.setText("MATSURI runs away!");
            endGame();
        }
    }

    private void updateStatus() {
        heroHP.setText("HP: " + heroHPValue);
        heroMP.setText("MP: " + heroMPValue);
    }

    private void bossAttack() {
        if (isBattleStarted) {
            messages.setText("UNKNOWN tries to suck MATSURI's blood!<br>");
            heroHPValue -= new Random().nextInt(20);
            if (heroHPValue <= 1) {
                endGame();
            }
            updateStatus();
        }
    }

    private void endGame() {
        isBattleStarted = false;
        setButtonsEnabled(false);
        messages.setText(createClearScreen());
    }

    private void addFlashEffect() {
        messages.setForeground(Color.WHITE);
        Timer timer = new Timer(500, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                messages.setForeground(Color.BLACK);
            }
        });
        timer.setRepeats(false);
        timer.start();
    }

    private void displayStory() {
        if (storyIndex < storyParts.length) {
            story.setText(storyParts[storyIndex]);
            storyIndex++;
            if (storyIndex == 5) {
                isBattleStarted = true;
                setButtonsEnabled(true);
            }
        }
    }

    private String createClearScreen() {
        return "ゲームクリア！🎉\n\n最終的にMATSURIはUNKNOWNを追い詰め、彼の邪悪な計画を阻止しました！\n仲間たちの元へ帰ることができたMATSURIは、再び平和な世界を取り戻しました。\nこの冒険を通じて、MATSURIは多くのことを学ぶことができました。";
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new Main().setVisible(true);
            }
        });
    }
}
