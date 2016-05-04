/* */ 
var paper = require('../../dist/paper-node');
var data = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAXAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUxMDE3MzA5NDAwODExRTBCQjkwRDlDMzRBOTRBODAyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUxMDE3MzBBNDAwODExRTBCQjkwRDlDMzRBOTRBODAyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTEwMTczMDc0MDA4MTFFMEJCOTBEOUMzNEE5NEE4MDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTEwMTczMDg0MDA4MTFFMEJCOTBEOUMzNEE5NEE4MDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAASDQ0NDw0TDw8THBIQEhwhGBMT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";
paper.setup(new paper.Canvas(600, 600));
with (paper) {
  var raster = new paper.Raster(data);
  raster.position = view.center;
  paper.view.exportFrames({
    amount: 1,
    directory: __dirname,
    onComplete: function() {
      console.log('Done exporting.');
    },
    onProgress: function(event) {
      console.log(event.percentage + '% complete, frame took: ' + event.delta);
    }
  });
}
