# Twisitor [![Build Status](https://travis-ci.org/twitter/twisitor.png?branch=master)](https://travis-ci.org/twitter/twisitor)

Twisitor is a simple and spectacular photo-tweeting birdhouse.

It's developed as a Chrome application (extension).

![Twisitor](https://github.com/twitter/twisitor/raw/master/images/twisitorapp.png)

## Getting Started

To get started, simply install Twisitor locally:

* Visit `chrome:extensions` in Google Chrome
* Check the "Developer mode" checkbox
* Click the "Load unpacked extension..." button
* Select the *app* directory, at `<PROJECT_ROOT>`

Setup the options as described below and then launch the application to begin!

## Setup

### Tweets

The first thing to do is to select your pre-populated tweets.

![Twisitor Pre-populated Tweets](https://github.com/twitter/twisitor/raw/master/images/prepopulatedtweets.png)

These are the messages displayed after taking a picture.

Note: {handles} is used as a the template for user specified Twitter handles

### Tweet Location

Enter the *optional* location (using a placeid) your tweets should come from:

![Twisitor OAuth Settings](https://github.com/twitter/twisitor/raw/master/images/tweetlocation.png)

Note: You can optionally use browser geolocation support to get your location.

### Shutter Time

Enter your shutter time in seconds:

![Twisitor Shutter Timer](https://github.com/twitter/twisitor/raw/master/images/shuttertimer.png)

### OAuth Settings

Fill in your OAuth settings for your Twitter account and application:

![Twisitor OAuth Settings](https://github.com/twitter/twisitor/raw/master/images/oauthsettings.png)

If you haven't done this before, create a new twitter application here: https://dev.twitter.com/apps/new

###

## Kiosk Mode

Are you running in Kiosk Mode?

Make sure Chrome was started with `--disable-dev-tools`

Another option is to:
* Edit `/Users/<username>/Library/Application Support/Google/Chrome/Default/Preferences`
* Add `disabled: true` to `devtools`

## Authors and Contributors

* Marcel Duran <https://twitter.com/marcelduran>
* Mo Kudeki <https://twitter.com/kudeki>
* Chris Aniszczyk <https://twitter.com/cra>
* Wenyu Zhang <https://twitter.com/wyz>

A special thanks to:
* Nick Fisher
* Adam Nace
* Laura Chan
* Olga Safronova
* Louise Chow
* Adelin Cai
* Henna Kermani
* Bryan Innes

## License
Copyright 2013 Twitter, Inc and other contributors.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
