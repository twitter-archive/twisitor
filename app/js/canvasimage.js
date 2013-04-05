'use strict';

function CanvasImage(canvas, width, height) {
  this.canvas = canvas[0];
  this.context = canvas[0].getContext('2d');
  this.width = this.canvas.width = width;
  this.height = this.canvas.height = height;
  canvas.width(width);
  canvas.height(height);
}

$.extend(CanvasImage.prototype, {
  getData: function() {
    return this.context.getImageData(0, 0, this.width, this.height);
  },

  setData: function(data) {
    this.context.putImageData(data, 0, 0);
  },

  newData: function() {
    return this.context.createImageData(0, 0);
  },

  fillText: function(text, x, y) {
    this.context.fillText(text, x, y);
  },

  setImage: function(img) {
    this.context.drawImage(img, 0, 0, this.width, this.height);
  }
});
