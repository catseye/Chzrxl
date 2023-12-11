Chzrxl
======

_Try it online_ [@ catseye.tc](https://catseye.tc/installation/Chzrxl)
| _See also:_ [Cyclobots](https://codeberg.org/catseye/Cyclobots#cyclobots)
∘ [noit o' mnain worb](https://codeberg.org/catseye/noit-o-mnain-worb#noit-o-mnain-worb)

_"Chzrxl, the Living Inkblot." Or is it some sort of self-attracting lava lamp?_

![screenshot](https://static.catseye.tc/images/screenshots/Chzrxl.jpg)

This is the reference distribution for **Chzrxl**, a dynamical system
fluid automaton thing devised by Chris Pressey in 2013.  It consists
of a set of blobs where each blob sways back and forth between two
points — the midpoints of two pairs of other blobs.  Of course, since
those four blobs are *also* moving, their midpoints move too, and
the result can be quite complex and chaotic.  In fact, in order to
prevent all the blobs from converging to a common point, a certain
number of the blobs (say, 5% of them) are typically held fixed while
the others move around them.

You can watch it online here: **[Chzrxl installation at catseye.tc][]**.

To run it locally, clone this repository and open
[demo/chzrxl.html](demo/chzrxl.html) in a web browser such as
Firefox.  (Note that, if opened as a local file, the browser may fall back
to canvas rendering; to ensure that WebGL is used, you can
[start a local server][], but to be frank it doesn't seem to make much
difference at this stage.)

The core behaviour is implemented in [src/chzrxl.js](src/chzrxl.js) and
does not rely on PixiJS or any other display layer.

The PixiJS driver and visuals are defined in
[demo/chzrxl-pixi-launcher.js](demo/chzrxl-pixi-launcher.js).

### History ###

The first implementation of Chzrxl was in Javascript, in 2013, and this
implementation (which we can call version 1.0) can be found in the
[HTML5 Gewgaws distribution][].

In 2019, this Javascript implementation was cleaned up and re-fitted to use
[PixiJS][], and that is the version in this repository (which we will call
version 1.1 or later).  Since PixiJS uses WebGL when possible, this version
has the potential to have much nicer visuals than the previous versions;
however, it is still a work-in-progress in this regard.

[Chzrxl installation at catseye.tc]: https://catseye.tc/installation/Chzrxl
[HTML5 Gewgaws distribution]: https://catseye.tc/distribution/HTML5%20Gewgaws%20distribution
[PixiJS]: http://www.pixijs.com/
[start a local server]: https://web.archive.org/web/20190117102459/https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally#run-local-server
