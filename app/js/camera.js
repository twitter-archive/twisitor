'use strict';

function Camera() {
  this.stream = null;
  this.streamURL = null;
  this.video = null;
}

$.extend(Camera.prototype, {
  getCamera: function (onSuccess, onError) {
    navigator.webkitGetUserMedia({audio: true, video: true}, onSuccess, onError); 
  },

  startCapture: function(onSuccess, onError) {
    this.onSuccess = onSuccess || $.noop;
    this.onError = onError || $.noop;
    this.getCamera(this.gotStream.bind(this), this.onError.bind(this));
  },

  gotStream: function(stream) {
    this.stream = stream;
    this.video = $('<video autoplay/>')[0];
    this.streamURL = window.URL.createObjectURL(this.stream);
    this.video.src = this.streamURL;
    this.onSuccess();
  }
});
