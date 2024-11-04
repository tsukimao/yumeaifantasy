export class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.loadedAssets = 0;
    this.totalAssets = 0;
    this.placeholderImage = this.createPlaceholder();
  }

  createPlaceholder() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 300, 300);
    
    // Draw placeholder text
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Image Not Found', 150, 150);
    
    return canvas.toDataURL();
  }

  async loadImage(name) {
    if (this.assets.has(name)) {
      return this.assets.get(name);
    }

    try {
      const img = new Image();
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => {
          this.loadedAssets++;
          this.updateLoadingProgress();
          resolve(img);
        };
        img.onerror = () => {
          console.warn(`Using placeholder for ${name}`);
          img.src = this.placeholderImage;
          this.loadedAssets++;
          this.updateLoadingProgress();
          resolve(img);
        };
      });

      img.src = `/assets/${name}`;
      const loadedImg = await loadPromise;
      this.assets.set(name, loadedImg);
      return loadedImg;
    } catch (error) {
      console.warn(`Fallback to placeholder for ${name}`);
      const placeholder = new Image();
      placeholder.src = this.placeholderImage;
      this.assets.set(name, placeholder);
      return placeholder;
    }
  }

  updateLoadingProgress() {
    const progress = Math.floor((this.loadedAssets / this.totalAssets) * 100);
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = `Loading... ${progress}%`;
    }
  }

  async preloadAll(assetList) {
    this.totalAssets = assetList.length;
    this.loadedAssets = 0;
    
    try {
      const loadPromises = assetList.map(asset => this.loadImage(asset));
      await Promise.all(loadPromises);
      return true;
    } catch (error) {
      console.warn('Some assets failed to load, using placeholders');
      return true; // Continue with placeholders
    }
  }

  getAsset(name) {
    return this.assets.get(name) || this.createPlaceholderImage(name);
  }

  createPlaceholderImage(name) {
    const img = new Image();
    img.src = this.placeholderImage;
    this.assets.set(name, img);
    return img;
  }
}