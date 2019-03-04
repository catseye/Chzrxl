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
    forceCanvas: (('' + window.location).indexOf('forceCanvas') !== -1),
    antialias: true,
    backgroundColor : 0xffffff
  });

  config.container.appendChild(app.view);

  var c = new Chzrxl().init({
    width: config.width,
    height: config.height,
    onUpdateBlob: function(blob) {
      blob.graphics.x = blob.x;
      blob.graphics.y = blob.y;
    }
  });

  function removeVisuals(c) {
    c.forEachBlob(function(blob) {
      if (blob.graphics) {
        blob.graphics.destroy();
      }
      blob.graphics = undefined;
    });
  }

  function setClassicVisuals(c) {
    c.forEachBlob(function(blob) {
      if (blob.graphics) return;
      var graphics = new PIXI.Graphics();
      var colour = hslToRgb(Math.floor(Math.random() * 360), 0.1, 0.5);
      // or, for a red-purplish gradient: var colour = 0xff0000 + blob.index;
      var radius = Math.floor(Math.random() * 10) + 5;
      graphics.lineStyle(0);
      graphics.beginFill(colour);
      graphics.drawCircle(0, 0, radius);
      graphics.endFill();
      app.stage.addChild(graphics);
      blob.graphics = graphics;
    });
  }

  function setBlurredVisuals(c) {
    c.forEachBlob(function(blob) {
      if (blob.graphics) return;
      var graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(0xff0000);
      graphics.drawCircle(0, 0, 10);
      graphics.endFill();
      graphics.filters = [new PIXI.filters.BlurFilter()];
      app.stage.addChild(graphics);
      blob.graphics = graphics;
    });
  }

  setClassicVisuals(c);

  app.ticker.add(function(delta) {
    c.update();
  });

  if (true) {
    function makeDiv(container, innerHTML) {
        var div = document.createElement('div');
        div.innerHTML = innerHTML || '';
        container.appendChild(div);
        return div;
    }
    function makeLabel(container, innerHTML) {
        var label = document.createElement('label');
        label.innerHTML = innerHTML || '';
        container.appendChild(label);
        return label;
    }
    function makeSlider(container, min_, max_, value, fun) {
      var slider = document.createElement('input');
      slider.type = "range";
      slider.min = min_;
      slider.max = max_;
      slider.value = value || 0;
      slider.onchange = function(e) {
        fun(parseInt(slider.value, 10));
      };
      container.appendChild(slider);
      return slider;
    }
    function makeSelect(container, labelText, optionsArray, fun) {
      var label = document.createElement('label');
      label.innerHTML = labelText;
      container.appendChild(label);
      var select = document.createElement("select");
      for (var i = 0; i < optionsArray.length; i++) {
        var op = document.createElement("option");
        op.value = optionsArray[i].value;
        op.text = optionsArray[i].text;
        select.options.add(op);
      }
      select.onchange = function(e) {
        fun(optionsArray[select.selectedIndex]);
      };
      select.selectedIndex = 0;
      label.appendChild(select);
      return select;
    };
    function makeRendererPanel(container) {
      var panel = makeDiv(container);
      var renderer = "unknown";
      if (app.renderer instanceof PIXI.WebGLRenderer) {
         renderer = "WebGL";
      } else if (app.renderer instanceof PIXI.CanvasRenderer) {
         renderer = "Canvas";
      }
      panel.innerHTML = "Renderer: " + renderer + ".";
      if (renderer !== "Canvas") {
        panel.innerHTML += ' <a href="?forceCanvas=1">Force Canvas renderer</a>.';
      }
    }
    function makeVisualsPanel(container) {
      var panel = makeDiv(container);
      makeSelect(panel, "Visuals:", [
        { text: "Classic", value: "1", setVisuals: setClassicVisuals },
        { text: "Blurred", value: "2", setVisuals: setBlurredVisuals }
      ], function(selection) {
        removeVisuals(c);
        selection.setVisuals(c);
      });
    }

    var controlPanel = makeDiv(config.container);
    var rendererPanel = makeRendererPanel(controlPanel);
    var visualsPanel = makeVisualsPanel(controlPanel);
    var label = makeLabel(controlPanel, "Percent to hold fixed:");
    makeSlider(label, 0, 100, 20, function(v) {
      c.setPercentToHoldFixed(v);
    });
  }
}
