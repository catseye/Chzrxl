Blob = function() {
    this.init = function(config) {
        this.index = config.index;
        this.x = config.x;
        this.y = config.y;
        this.pt1 = config.pt1;
        this.pt2 = config.pt2;
        this.rate = config.rate;
        this.phase = config.phase;
        this.colour = config.colour;
        this.blobs = config.blobs;
        return this;
    };

    this.update = function(t) {
        // p is between 0.0 (at pt1) and 1.0 (at pt2)
        var p = (Math.sin((t + this.phase) / this.rate) + 1) / 2;

        var blob1 = this.blobs[this.pt1];
        var blob2 = this.blobs[this.pt2];

        var x1 = blob1.x;
        var x2 = blob2.x;
        this.x = (x2 - x1) * p + x1;
        var y1 = blob1.y;
        var y2 = blob2.y;
        this.y = (y2 - y1) * p + y1;
    };
};


Chzrxl = function() {
    this.init = function(config) {
        this.width = config.width;
        this.height = config.height;
        this.blobs = [];
        this.numBlobs = 200;
        this.numToHoldFixed = Math.floor(this.numBlobs * 0.20);
        this.onUpdateBlob = config.onUpdateBlob;
        this.reset();
        return this;
    };

    this.forEachBlob = function(callback) {
        for (var i = 0; i < this.blobs.length; i++) {
            callback(this.blobs[i]);
        }
    };

    this.reset = function() {
        this.blobs = [];
        this.tick = 0;
        for (var i = 0; i < this.numBlobs; i++) {
            var x = Math.random() * this.width;
            var y = Math.random() * this.height;
            var pt1 = i;
            var pt2;
            while (pt1 === i || pt2 === i || pt2 === pt1) {
               pt1 = Math.floor(Math.random() * this.numBlobs);
               pt2 = Math.floor(Math.random() * this.numBlobs);
            }
            var rate = Math.random() * 100 + 100;
            var phase = Math.floor(Math.random() * 110);
            this.blobs.push(new Blob().init({
                index: i,
                x: x,
                y: y,
                pt1: pt1,
                pt2: pt2,
                rate: rate,
                phase: phase,
                colour: 0xff0000 + i,
                blobs: this.blobs,
                onInitBlob: this.onInitBlob
            }));
        }
    };

    this.update = function() {
        for (var i = 0; i < this.blobs.length; i++) {
            if (i < this.numToHoldFixed) continue;
            var blob = this.blobs[i];
            blob.update(this.tick);
            if (this.onUpdateBlob) this.onUpdateBlob(blob);
        }
        this.tick += 1;
    };

    this.setPercentToHoldFixed = function(percent) {
        this.numToHoldFixed = Math.floor(this.numBlobs * (percent / 100));
    };
};
