// SoundSystem.js
class SoundSystem {
    constructor(game) {
        this.game = game;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = this.audioContext.createGain();
        this.masterVolume.connect(this.audioContext.destination);
        this.sounds = new Map();
        this.initializeSounds();
    }

    initializeSounds() {
        // 攻撃音
        this.sounds.set('attack', {
            type: 'square',
            frequency: 220,
            duration: 0.1,
            volume: 0.3,
            envelope: { attack: 0.01, decay: 0.1 }
        });

        // 魔法音
        this.sounds.set('magic', {
            type: 'sine',
            frequency: 440,
            duration: 0.3,
            volume: 0.2,
            envelope: { attack: 0.05, decay: 0.2 }
        });

        // 黒の聖餐音
        this.sounds.set('darkCommunion', {
            type: 'sawtooth',
            frequency: 110,
            duration: 0.5,
            volume: 0.4,
            envelope: { attack: 0.1, decay: 0.4 }
        });

        // ダメージ音
        this.sounds.set('damage', {
            type: 'triangle',
            frequency: 330,
            duration: 0.15,
            volume: 0.25,
            envelope: { attack: 0.01, decay: 0.1 }
        });
    }

    async playSound(soundName) {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        const sound = this.sounds.get(soundName);
        if (!sound) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = sound.type;
        oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            sound.volume,
            this.audioContext.currentTime + sound.envelope.attack
        );
        gainNode.gain.linearRampToValueAtTime(
            0,
            this.audioContext.currentTime + sound.duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.masterVolume);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    }

    async playDarkCommunionSound() {
        const now = this.audioContext.currentTime;
        const duration = 1.0;

        // 低音のうなり
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(110, now);
        bassOsc.frequency.linearRampToValueAtTime(55, now + duration);
        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        bassGain.gain.linearRampToValueAtTime(0, now + duration);

        // 高音の効果音
        const highOsc = this.audioContext.createOscillator();
        const highGain = this.audioContext.createGain();
        highOsc.type = 'sawtooth';
        highOsc.frequency.setValueAtTime(440, now);
        highOsc.frequency.linearRampToValueAtTime(880, now + duration * 0.5);
        highGain.gain.setValueAtTime(0, now);
        highGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
        highGain.gain.linearRampToValueAtTime(0, now + duration);

        bassOsc.connect(bassGain);
        highOsc.connect(highGain);
        bassGain.connect(this.masterVolume);
        highGain.connect(this.masterVolume);

        bassOsc.start(now);
        highOsc.start(now);
        bassOsc.stop(now + duration);
        highOsc.stop(now + duration);
    }

    async playBattleSound() {
        const now = this.audioContext.currentTime;
        
        const oscillators = [
            { type: 'square', frequency: 220, duration: 0.1 },
            { type: 'sine', frequency: 440, duration: 0.15 },
            { type: 'triangle', frequency: 330, duration: 0.12 }
        ];

        oscillators.forEach((osc, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = osc.type;
            oscillator.frequency.setValueAtTime(osc.frequency, now + index * 0.05);

            gainNode.gain.setValueAtTime(0, now + index * 0.05);
            gainNode.gain.linearRampToValueAtTime(0.2, now + index * 0.05 + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, now + index * 0.05 + osc.duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.masterVolume);

            oscillator.start(now + index * 0.05);
            oscillator.stop(now + index * 0.05 + osc.duration);
        });
    }

    setMasterVolume(value) {
        this.masterVolume.gain.setValueAtTime(
            Math.max(0, Math.min(1, value)),
            this.audioContext.currentTime
        );
    }

    async initialize() {
        // iOS Safariなどで必要な初期化
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}
