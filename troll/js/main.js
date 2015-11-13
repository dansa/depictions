  var width = 40,
      amount = 4,
      particlesNum = 5,
      elements = [],
      sizes = {},
      particles = new Group(),
      batIn = new Shape.Rectangle(),
      batOut = new Shape.Rectangle(),
      batPerc = 0.6;

  function setup() {
    fitToContainer(world);
    for(var i = 0; i <= particlesNum; i++ ){
      newC();
    }
    newFrame();
  }

  function fitToContainer(canvas) {
    //canvas.width = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;
    
    sizes.view = [canvas.width,canvas.height];

    var context = canvas.getContext('2d'),
    devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1,
    ratio = devicePixelRatio / backingStoreRatio;
    if (devicePixelRatio !== backingStoreRatio) {
      console.log("kek");
        var oldWidth = canvas.offsetWidth;
        var oldHeight = canvas.offsetHeight;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';
        context.scale(ratio, ratio);

    }
    view.viewSize = new Size(canvas.width, canvas.height);
    sizes.particles = [sizes.view[0], sizes.view[1]*0.25];
    sizes.battery = [sizes.view[0]*0.35, sizes.view[1]*0.35];
    stuff();
  }

  function stuff(){
    var rectO = new Rectangle([0,0],[sizes.battery[0], sizes.battery[1]]);
    batOut = new Path.Rectangle(rectO, 6);
    batOut.strokeColor = "#FFF";
    batOut.strokeWidth = "5";
    batOut.bringToFront();
    batOut.position = new Point(
      view.center.x,
      sizes.view[1] - sizes.particles[1] - sizes.battery[1]/2);
    var rectI = new Rectangle([0,0],[sizes.battery[0]-4, sizes.battery[1]-14]);
    batIn = new Shape.Rectangle(rectI);
    batIn.position = batOut.position;
    batIn.position.y += +7;
    batIn.fillColor = '#00FF01';
    batIn.sendToBack();
    batIn.scale(1, batPerc, batIn.bounds.bottomLeft);
    var rectC = new Rectangle([0,0],[20, 8]);
    var batCap = new Path.Rectangle(rectC,2);
    batCap.fillColor = "#FFF";
    batCap.position = new Point(
      view.center.x,
      batOut.strokeBounds.topCenter.y);
  }

  function randX(container) {
    var x = -1 + Math.random() * 2;
    return (x * width + container.center.x);
  }

  function mathMinMax(min, max, zto){
    if (zto) {
      min = min*100; max = max*100;
      return ((Math.random() * (max - min + 1)) + min)/100;
    }
    return (Math.random() * (max - min + 1)) + min;
  }

  function getPath() {
    var y = sizes.view[1];
    var point = [
        [view.center.x, y],
        [randX(view), y-sizes.particles[1] * mathMinMax(0.20, 0.30, true)],
        [randX(view), y-sizes.particles[1] * mathMinMax(0.40, 0.60, true)],
        [randX(view), y-sizes.particles[1] * mathMinMax(0.70, 0.80, true)],
        [view.center.x, y-sizes.particles[1]]
      ],
      path = new Path({});

    for (var i = 0; i <= amount; i++) {
      path.add(new Point(point[i]));
    }

    //path.selected = true;
    path.smooth();
    return path;
  }

  function newC() {
    var c = new Path.Circle(view.center.x, 0, 4);
    c.fillColor = "#00FF01";
    c.opacity = mathMinMax(0.20,0.8,true);
    c.p = getPath();
    c.s = Math.ceil(mathMinMax(1,2));
    elements.push(c);
    particles.addChild(c);
  }

  function move(e, ofs) {
    var loc = e.p.getLocationAt(ofs % e.p.length);
    if (loc) {
      e.position = loc.point;
    }
    if (ofs >= e.p.length) {
      newFrame(e);
    }
  }

  var frameHandler = function(event) {
    var offset = event.count * this.s;
    move(this, offset);
  };

  function newFrame(element) {
    if(element){
      element.p.remove();
      element.position = element.p.firstSegment.point;
      element.off('frame');
      element.p = getPath();
      element.s = Math.ceil(mathMinMax(1,2));
      element.on('frame', frameHandler);
      return false;
    }
    for (var i = 0; i < elements.length; i++) {
      elements[i].on('frame', frameHandler);
    }
  }
setup();
    var wWidth, wHeight, wCenter;
    var wCon = batIn;
    var y = wCon.bounds.topCenter.y;
    var points = 5;
    var wave = new Path();
    var mousePos = new Point(wCon.bounds.center.x, y - 6);
    var waveHeight = (y - mousePos.y) / 10;

    wave.fillColor = '#00FF01';
    initializePath();

    function initializePath() {
      wCenter = new Point(wCon.bounds.center.x, y);
      wWidth = wCon.size.width;
      wHeight = y -8;
      wave.segments = [];
      wave.add(wCon.bounds.topLeft.x, Math.ceil(y));
      wave.add(wCon.bounds.topLeft.x, y -5);
      for (var i = 1; i < points; i++) {
        var point = new Point(wCon.bounds.topLeft.x + wWidth / points * i, wCenter.y);
        wave.add(point);
      }
      wave.add(wCon.bounds.topRight.x, y -5);
      wave.add(wCon.bounds.topRight.x, Math.ceil(y));
      wave.insertBelow(batIn);
    }
function onFrame(event){
      waveHeight += (wCenter.y - mousePos.y - waveHeight)/ 10 ;
      for (var i = 2; i < points+1; i++) {
        var sinSeed = event.count + (i + i % 100) * 100;
        var sinHeight = Math.sin(sinSeed / 100) * waveHeight;
        var yPos = Math.sin(sinSeed / 100) * sinHeight + wHeight;
        wave.segments[i].point.y = yPos;
      }
      wave.smooth();
    }



