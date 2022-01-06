class Bitgu extends Jig {
        init(owner, metadata, seriesdata, properties, image) {
            if (!caller || !(caller instanceof Series)) {
                throw new Error('Must create from Series'); }
            expect(image).toBeInstanceOf(B);
            this.owner = owner;
            this.metadata = metadata;
            this.seriesdata = seriesdata;
            this.properties = properties;
            this.image = image;
            this.history = [];
        }
        send(to) {
            if (this.properties.level < 50) {
                this.properties.level = this.properties.level + 1; }
            this.sender = this.owner;
            this.history.push(this.owner);
            this.owner = to;
        }
        getImage() {
            let img = new Image();
            img.loaded = false;
            img.onload(()=>{ img.loaded = true; })
            img.src = this.getImageData();
            return img;
        }
        getImageData() {
            return 'data:' + this.image.mediaType + ';base64,' + this.image.base64Data;
        }
    }

    //0d46b2440898b1060debca8ed0eb3f7ed0513a970459fa99f1e0c57242a55916_o3
