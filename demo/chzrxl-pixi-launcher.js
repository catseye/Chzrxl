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

function makeDiv(container, innerHTML) {
    var div = document.createElement('div');
    div.innerHTML = innerHTML || '';
    container.appendChild(div);
    return div;
}

function makeSpan(container, innerHTML) {
  var span = document.createElement('span');
  span.innerHTML = innerHTML || '';
  container.appendChild(span);
  return span;
}

function makeLabel(container, innerHTML) {
    var label = document.createElement('label');
    label.innerHTML = innerHTML || '';
    container.appendChild(label);
    return label;
}

function makeButton(container, labelText, fun) {
  var button = document.createElement('button');
  button.innerHTML = labelText;
  container.appendChild(button);
  button.onclick = fun;
  return button;
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
}

function removeVisuals(c) {
  c.forEachBlob(function(blob) {
    if (blob.graphics) {
      blob.graphics.destroy();
    }
    blob.graphics = undefined;
  });
}

function setClassicVisuals(c, stage) {
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
    stage.addChild(graphics);
    blob.graphics = graphics;
  });
}

function setNoiseVisuals(c, stage) {
  c.forEachBlob(function(blob) {
    if (blob.graphics) return;
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(0);
    graphics.beginFill(0x808080);
    graphics.drawCircle(0, 0, 10);
    graphics.endFill();
    graphics.filters = [new PIXI.filters.NoiseFilter()];
    stage.addChild(graphics);
    blob.graphics = graphics;
  });
}

function setUpPixiApp(config, c) {
  var app = new PIXI.Application({
    width: config.width,
    height: config.height,
    forceCanvas: config.forceCanvas,
    antialias: true,
    backgroundColor : 0xffffff
  });

  config.container.insertBefore(app.view, config.container.firstChild);

  app.ticker.add(function(delta) {
    c.update();
  });

  return { app: app };
}

function getRenderer(app) {
  if (app.renderer instanceof PIXI.WebGLRenderer) {
     return "WebGL";
  } else if (app.renderer instanceof PIXI.CanvasRenderer) {
     return "Canvas";
  }
  return "unknown";
}

function launch(config) {
  var c = new Chzrxl().init({
    width: config.width,
    height: config.height,
    onUpdateBlob: function(blob) {
      blob.graphics.x = blob.x;
      blob.graphics.y = blob.y;
    }
  });

  var r = setUpPixiApp(config, c);
  var app = r.app;

  setClassicVisuals(c, app.stage);

  var controlPanel = makeDiv(config.container);

  /*----- renderer panel -----*/
  var rendererPanel = makeDiv(controlPanel);
  var rendererSpan = makeSpan(rendererPanel);
  var renderer = getRenderer(app);
  rendererSpan.innerHTML = "Renderer: " + renderer + ".";
  if (renderer !== "Canvas") {
    var forceCanvasButton;
    forceCanvasButton = makeButton(rendererPanel, "Force Canvas renderer", function(e) {
      removeVisuals(c);
      app.destroy(true, true);
      config.forceCanvas = true;
      r = setUpPixiApp(config, c);
      app = r.app;
      setClassicVisuals(c, app.stage);
      forceCanvasButton.remove();
      rendererSpan.innerHTML = "Renderer: Canvas.";
    });
  }

  /*----- visuals panel -----*/
  var visualsPanel = makeDiv(controlPanel);
  makeSelect(visualsPanel, "Visuals:", [
    { text: "Classic", value: "1", setVisuals: setClassicVisuals },
    { text: "Noisy", value: "2", setVisuals: setNoiseVisuals }
  ], function(selection) {
    removeVisuals(c);
    selection.setVisuals(c, app.stage);
  });

  var label = makeLabel(controlPanel, "Percent to hold fixed:");
  makeSlider(label, 0, 100, 20, function(v) {
    c.setPercentToHoldFixed(v);
  });
}
