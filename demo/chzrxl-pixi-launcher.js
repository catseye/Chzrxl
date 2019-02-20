/*
 * pixi-min.js and chzrxl.js must be loaded before this source.
 * After loading this source, call launch() to create and start the gewgaw.
 */

// hslToRgb function adapted from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let hp = h / 60.0;
  let x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb1;
  if (isNaN(h)) rgb1 = [0, 0, 0];
  else if (hp <= 1) rgb1 = [c, x, 0];
  else if (hp <= 2) rgb1 = [x, c, 0];
  else if (hp <= 3) rgb1 = [0, c, x];
  else if (hp <= 4) rgb1 = [0, x, c];
  else if (hp <= 5) rgb1 = [x, 0, c];
  else if (hp <= 6) rgb1 = [c, 0, x];
  let m = l - c * 0.5;
  return (
    (Math.round(255 * (rgb1[0] + m)) << 16) |
    (Math.round(255 * (rgb1[1] + m)) << 8) |
    (Math.round(255 * (rgb1[2] + m)))
  );
}

function launch(config) {
  var app = new PIXI.Application({ 
    width: config.width,
    height: config.height,
    forceCanvas: false,
    antialias: true,
    backgroundColor : 0xffffff
  });

  config.container.appendChild(app.view);

  var c = new Chzrxl().init({
    width: config.width,
    height: config.height,
    onInitBlob: function(blob) {
      var colour = hslToRgb(Math.floor(Math.random() * 360), 0.1, 0.5);
      // or, for a red-purplish gradient: var colour = 0xff0000 + blob.index;
      var radius = Math.floor(Math.random() * 10) + 5;

      var graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(colour);
      graphics.drawCircle(0, 0, radius);
      graphics.endFill();
      app.stage.addChild(graphics);
      blob.graphics = graphics;
    },
    onUpdateBlob: function(blob) {
      blob.graphics.x = blob.x;
      blob.graphics.y = blob.y;
    }
  });

  app.ticker.add(function(delta) {
    c.update();
  });

  if (config.controlPanel) {
    function makeSlider(container, min_, max_, value, fun) {
      var slider = document.createElement('input');
      slider.type = "range";
      slider.min = min_;
      slider.max = max_;
      slider.value = value || 0;
      if (fun) {
        slider.onchange = function(e) {
          fun(parseInt(slider.value, 10));
        };
      }
      container.appendChild(slider);
      return slider;
    }

    var label = document.createElement('label');
    label.innerHTML = "Percent to hold fixed:";
    config.controlPanel.appendChild(label);
    makeSlider(label, 0, 100, 20, function(v) {
      c.setPercentToHoldFixed(v);
    });
  }
}
