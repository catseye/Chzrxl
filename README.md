Chzrxl
======

![screenshot](https://static.catseye.tc/images/screenshots/Chzrxl.jpg)

This is the reference distribution for **Chzrxl**, a dynamical system
fluid automaton thing devised by Chris Pressey in 2014.  It consists
of a set of blobs where each blob sways back and forth between two
points — the midpoints of two pairs of other blobs.  Of course, since
those four blobs are *also* moving, their midpoints move too, and
the result can be quite complex and chaotic.  In fact, in order to
prevent all the blobs from converging to a common point, a certain
number of the blobs (say, 20% of them) are held fixed while the others
move around them.

You can watch it online here: [Chzrxl installation at catseye.tc][].
(But note that, as of this writing, this is not the version in this
repository; it is the version from the [HTML5 Gewgaws distribution][]).

Being built on [PixiJS][], the version in this repo has the potential to
have much nicer visuals; however, it is still a work-in-progress.
To see it, clone this repository and open
[demo/chzrxl.html](demo/chzrxl.html) in a web browser such as
Firefox.

(If opened as a local file, it may fall back to canvas rendering; to
ensure that WebGL is used, you can [start a local server][], but to be
frank it doesn't seem to make much difference at this point.)

(TODO: bring this implementation up to par with the other one, and install
this one online at catseye.tc instead.)

The core behaviour is implemented in [src/chzrxl.js](src/chzrxl.js) and
does not rely on PixiJS or any other display layer.

[Chzrxl installation at catseye.tc]: https://catseye.tc/installation/Chzrxl
[HTML5 Gewgaws distribution]: https://catseye.tc/distribution/HTML5%20Gewgaws%20distribution
[PixiJS]: http://www.pixijs.com/
[start a local server]: https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally#run-local-server
