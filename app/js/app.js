'use strict';

// initialize options
if (!localStorage.getItem('statuses')) {
  localStorage.setItem('statuses',
    [
      'Hey&#44; it\'s {handles} at the @Twoffice!',
      'Thanks @Twoffice for having {handles} here!',
      'Twish you were here! Love&#44; {handles}'
    ].join(',')
  );
}

// fullscreen
chrome.windows.getCurrent(null, function(win) {
  chrome.windows.update(win.id, {state: 'fullscreen'});
});

var camera = null;

var App = {
  init: function() {
    camera = new Camera();
    camera.startCapture(this.onCameraReady.bind(this), $.noop);
  },

  start: function() {
    this.$btnStart = $('#btnStart');
    this.$wizard = $('#dlgWizard');
    this.$btnClose = $('.close');
    this.$dlgTitle = $('#dlgTitle');
    this.$btnNext = $('#btnNext');
    this.$btnBack = $('#btnBack');
    this.$monitor = $('#monitor');
    this.monitor = new CanvasImage(this.$monitor, 640, 480);

    this.scenePhotobooth.load();
    this.sceneTwitterHandle.load();
    this.sceneStatusSelection.load();
    this.sceneTweetConfirm.load();

    this.$btnStart.on('click', function() {
      App.scenePhotobooth.reset();
      App.sceneTwitterHandle.reset();
      App.sceneStatusSelection.reset();
      App.sceneTweetConfirm.reset();

      App.currentScene = App.scenePhotobooth;
      App.currentScene.show();
      App.$wizard.modal('show');
    });

    this.$btnNext.on('click', function() {
      App.currentScene.next();
    }.bind(App.currentScene));

    this.$btnBack.on('click', function() {
      App.currentScene.back();
    }.bind(App.currentScene));

    this.$btnClose.on('click', function() {
      App.$wizard.modal('hide');
      App.currentScene.hide();
    });
  },

  onCameraReady: function() {
    this.start();
  },

  enableCamera: function() {
    this.cameraEnabled = true;
    this.onNewFrame();
  },

  disableCamera: function() {
    this.cameraEnabled = false;
  },

  onNewFrame: function() {
    this.monitor.setImage(camera.video);
    if (this.cameraEnabled) {
      webkitRequestAnimationFrame(this.onNewFrame.bind(this));
    }
  },

  scenePhotobooth: {
    load: function() {
      this.$body = $('#scenePhotobooth');
      this.$body.hide();
      this.$btnTimer = $('#btnTimer');
      this.$counter = $('#counter');
      this.$flash = $('#flash');
      this.$btnTimer.on('click', this.timer.bind(this));
      App.snapshot = new CanvasImage($('<canvas/>'), 640, 480);
      this.thumbnail = new CanvasImage($('<canvas/>'), 160, 120);
    },

    reset: function() {
      this.countdown = 0;
      this.thumbnailDataURL = null;
    },

    show: function() {
      App.$dlgTitle.text('Twisitor');
      App.enableCamera();
      App.$btnBack.hide();
      App.$btnNext.hide();
      this.$btnTimer.show();
      this.$body.show();
      this.$flash.removeClass('off');
    },

    hide: function() {
      App.disableCamera();
      this.$body.hide();
      this.$btnTimer.hide();
      App.$btnBack.show();
      App.$btnNext.show();
      App.$btnClose.show();
    },

    timer: function() {
      App.$btnClose.hide();
      this.$btnTimer.hide();
      this.countdown = parseInt(localStorage.getItem('countdown'), 10) || 5;
      this.countdownShutter();
    },

    play: function(name) {
      var audio = $('<audio src="audio/' + name + '.mp3" type="audio/mpeg" autoplay/>');
      $(document.body).append(audio);
      setTimeout(function() {
        audio.remove();
      }, 500);
    },

    countdownShutter: function() {
      if (this.countdown > 0) {
        this.play('chirp');

        this.$counter.text(
          (this.countdown > 3) ? 'Get ready!' : this.countdown
        );

        --this.countdown;
        setTimeout(this.countdownShutter.bind(this), 1000);
      } else {
        this.play('shutter');
        this.$counter.text('');
        this.$flash.addClass('off');
        App.disableCamera();
        this.thumbnail.setImage(camera.video);
        this.thumbnailDataURL = this.thumbnail.canvas.toDataURL();
        $('.thumbnail').attr('src', App.scenePhotobooth.thumbnailDataURL);
        App.snapshot.setImage(camera.video);
        setTimeout(this.next.bind(this), 750);
      }
    },

    next: function() {
      this.$flash.removeClass('off');
      this.hide();
      App.currentScene = App.sceneTwitterHandle;
      App.currentScene.show();
    }
  },

  sceneTwitterHandle: {
    load: function() {
      this.$body = $('#sceneTwitterHandle');
      this.$body.hide();
      this.$container = $('#handlesContainer');
      this.$handles = [];

      for (var i = 0; i < 5; ++i) {
        var $handle = $(
          '<div class="input-prepend">' +
          '<span class="add-on">@</span>' +
          '<input type="text" class="span2 handle" ' +
            'maxlength="15" placeholder="Twitter handle">' +
          '</div>'
        );

        this.$handles.push($handle.find('input'));
        this.$container.append($handle);
      }
    },

    reset: function() {
      for (var i = 0; i < this.$handles.length; ++i) {
        this.$handles[i].val('');
      }

      this.handles = '';
    },

    show: function() {
      App.$dlgTitle.text('Enter Your Twitter Handle');
      this.$body.show();
    },

    hide: function() {
      this.$body.hide();
    },

    back: function() {
      this.hide();
      App.currentScene = App.scenePhotobooth;
      App.currentScene.show();
    },

    next: function() {
      var handleChecker = /^[_0-9A-Za-z]{1,15}$/;
      this.handles = '';

      for (var i = 0; i < this.$handles.length; ++i) {
        var val = this.$handles[i].val().trim();

        if (handleChecker.test(val)) {
          this.handles += ' @' + val;
        }
      }

      this.handles = this.handles.trim().split(' ').join(', ');
      var idx = this.handles.lastIndexOf(', ');
      if (idx > -1) {
        this.handles = this.handles.slice(0, idx) + ' and ' +
          this.handles.slice(idx + 2);
      }

      if (!this.handles.length) {
        this.handles = 'me';
      }

      this.hide();
      App.currentScene = App.sceneStatusSelection;
      App.currentScene.show();
    }
  },

  sceneStatusSelection: {
    load: function() {
      this.$body = $('#sceneStatusSelection');
      this.$body.hide();
      this.$container = $('#statusesContainer');
    },

    reset: function() {
      this.$statusButtons = [];
      this.$container.empty();

      for (var i = 0; i < this.statuses.length; ++i) {
        var $btn = $('<button type="button" class="btn statusButton"/>');
        this.$statusButtons.push($btn);
        this.$container.append($btn);
      }

      this.$statusButtons[0].addClass('active');
    },

    show: function() {
      App.$dlgTitle.text('Select your Tweet');
      this.$body.show();
      App.$btnNext.text('Tweet!');

      var handles = App.sceneTwitterHandle.handles;

      for (var i = 0; i < this.statuses.length; ++i) {
        var text = this.statuses[i].replace('{handles}', handles);
        this.$statusButtons[i].text(text).data('val', text);
      }
    },

    hide: function() {
      App.$btnNext.text('Next');
      this.$body.hide();
    },

    back: function() {
      this.hide();
      App.currentScene = App.sceneTwitterHandle;
      App.currentScene.show();
    },

    next: function() {
      this.hide();
      App.currentScene = App.sceneTweetConfirm;
      App.currentScene.show();
    },

    statuses: localStorage.getItem('statuses').split(',').map(function(s) {
                return s.replace(/&#44;/g, ',');
              })
  },

  sceneTweetConfirm: {
    load: function() {
      this.$body = $('#sceneTweetConfirm');
      this.$body.hide();
      this.$message = this.$body.find('.message');
      this.$tweet = $('#tweet');
      this.$status = this.$tweet.find('.status');
      this.$details = this.$tweet.find('.details');
    },

    reset: function() {
    },

    show: function() {
      App.$btnBack.hide();
      App.$btnNext.hide();
      App.$dlgTitle.text('Posting your Tweet');
      this.$message.text('Please wait...');
      this.$body.show();

      var that = this;
      var status = $('.statusButton.active').data('val');

      this.$tweet.css('background', 'url(' + App.snapshot.canvas.toDataURL() +
        ')');
      this.$status.text(status);

      var now = new Date();
      var details = {
        h: (now.getHours() % 12) ? now.getHours() % 12 : 12,
        m: ('00' + now.getMinutes()).slice(now.getMinutes().toString().length),
        ap: now.getHours() > 12 ? 'PM' : 'AM',
        d: now.getDate(),
        M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
          'Oct', 'Nov', 'Dec'][now.getMonth()],
        y: now.getFullYear().toString().slice(2),
        loc: 'Twitter HQ, San Francisco'
      };
      var mask = '{h}:{m} {ap} - {d} {M} {y} from {loc}';
      Object.keys(details).forEach(function(key) {
        mask = mask.replace('{' + key + '}', details[key]);
      });
      this.$details.text(mask);

      Twitter.tweet(
        status,
        App.snapshot.canvas.toDataURL('image/jpeg').slice(23),
        function() {
          that.$message.text('Thank you!');
          setTimeout(function() {
            that.next();
          }, 5000);
        }
      );
    },

    hide: function() {
      this.$body.hide();
    },

    back: function() {
    },

    next: function() {
      this.hide();
      App.$wizard.modal('hide');
    }
  }
};

$('body').ready(App.init.bind(App));
