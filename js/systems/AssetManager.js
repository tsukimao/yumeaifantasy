// js/systems/AssetManager.js
class AssetManager {
    constructor() {
        this.assets = new Map();
    }

    async loadAsset(key, url) {
        try {
            const img = await this.loadImage(url);
            this.assets.set(key, img);
            return img;
        } catch (error) {
            console.error(`Failed to load asset: ${key}`, error);
            throw error;
        }
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }

    getAsset(key) {
        return this.assets.get(key);
    }
}
