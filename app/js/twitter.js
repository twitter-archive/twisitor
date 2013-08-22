'use strict';

window.Twitter = {
  tweet: function(status, media_data, callback) {
    var data,
        api_url = 'https://api.twitter.com/1.1/statuses/update_with_media.json';

    data = {
      'status': status,
      'media[]': media_data || '',
      'place_id': localStorage.getItem('placeid'),
      'display_coordinates': true
    };

    function tweet(pos) {
      if (pos && pos.coords) {
        data.lat = pos.coords.latitude;
        data.long = pos.coords.longitude;
      }

      data = this._buildFormData(data);

      $.ajax({
        url: api_url,
        type: 'POST',
        contentType: false,
        processData: false,
        cache: false,
        data: data,
        complete: callback,
        headers: {
          'Authorization': this._sign('POST', api_url)
        }
      });
    }

    if (localStorage.getItem('geolocation') === 'true') {
      navigator.geolocation.getCurrentPosition(tweet.bind(this),
        tweet.bind(this));
    } else {
      tweet.call(this);
    }

  },

  _sign: function(method, path, parameters) {
    if (parameters) {
      parameters += '&oauth_signature_method="HMAC-SHA1"';
    } else {
      parameters = 'oauth_signature_method="HMAC-SHA1"';
    }

    var param = {
      action: method,
      path: path,
      parameters: parameters,
      signatures: this._oauth_signatures
    };

    return (new OAuthSimple()).sign(param).header;
  },

  _buildFormData: function(obj) {
    var data = new FormData();

    $.each(obj, function(k, v) {
      data.append(k, v);
    });

    return data;
  },

  _oauth_signatures: {
    consumer_key: localStorage.getItem('consumer-key'),
    shared_secret: localStorage.getItem('shared-secret'),
    access_token: localStorage.getItem('access-token'),
    access_secret: localStorage.getItem('access-secret')
  }
};
