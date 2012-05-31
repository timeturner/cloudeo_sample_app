/**
 * Copyright (C) SayMama Ltd 2012
 *
 * All rights reserved. Any use, copying, modification, distribution and selling
 * of this software and it's documentation for any purposes without authors'
 * written permission is hereby prohibited.
 */
/**
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 25-04-2012 13:01
 */

var UPDATE_DESCR_BASE = 'http://www.cloudeo.tv/plugin/update.';

var PLUGIN_CONTAINER_ID = 'pluginContainer';

/**
 *
 * CloudeoPlugin instance.
 * @type CDO.CloudeoPlugin
 */
var plugin;

/**
 * CloudeoService instance.
 * @type CDO.CloudeoService
 */
var service;

//noinspection StringLiteralBreaksHTMLJS

/**
 * Template for rendering remote user video feed.
 * @type {String}
 */
var RENDER_TMPL = '<li id="userFeed#" class="remote-feed"></li>';

/**
 * Template for rendering local user video feed.
 * @type {String}
 */
var RENDER_LOCAL_TMPL = '<li id="userFeed#"></li>';

/**
 * Id of scope to which user is connected.
 */
var connectedScopeId;

/**
 * Connection descriptor - describes the connection to be established.
 * @type {Object}
 */
var CONNECTION_DESCRIPTOR = {
  lowVideoStream:{
    publish:true,
    receive:true,
    maxWidth:80,
    maxHeight:60,
    maxBitRate:30,
    maxFps:15
  },
  highVideoStream:{
    publish:true,
    receive:true,
    maxWidth:320,
    maxHeight:240,
    maxBitRate:400,
    maxFps:30
  },
  autopublishVideo:true,
  autopublishAudio:true,
  url:"67.228.150.188:704/",
  publishAudio:true,
  publishVideo:true,
  "token":"1"

};


/**
 * Initializes the plugin by:
 * - setting up cloudeo logging
 * - checking whether it's installed, if so - create CloudeoService
 * - show the install plugin button otherwise
 */
function initPlugin() {
  initUI();

//  Setup logging using our handler
  CDO.initLogging(function (lev, msg) {
    switch (lev) {
      case "DEBUG":
        log_d("[CDO] " + msg);
        break;
      case "WARN":
        log_e("[CDO] " + msg);
        break;
      case "ERROR":
        log_e("[CDO] " + msg);
        break;
      default:
        log_e("Got unsupported log level: " + lev + ". Message: " + msg);
    }
  }, true);
  log_d("Initializing the plug-in");

//  Try to load the plugin
  plugin = new CDO.CloudeoPlugin(PLUGIN_CONTAINER_ID);
  var loadStatus = plugin.loadPlugin();
  if (loadStatus) {
//    Plugin is installed
    tryUpdatePlugin();
  } else {
//    Plugin requires installation
    showInstallFrame();
  }
}

/**
 * Initialize the UI components.
 */
function initUI() {
  $('#webcamsSelect').append($('<option value="none">-- Select --</option> ')).val('none');
  $('#webcamsSelect').change(function () {
    var selected = $(this).val();
    service.setVideoCaptureDevice(CDO.createResponder(function () {
      window.configuredDevice = selected;
      startLocalPreview();
    }), selected);
  });
  $('#publishAudioChckbx').change(getPublishChckboxChangedHandler(CDO.MEDIA_TYPE_AUDIO));
  $('#publishVideoChckbx').change(getPublishChckboxChangedHandler(CDO.MEDIA_TYPE_VIDEO));
}

function getPublishChckboxChangedHandler(mediaType) {
  return function () {
    if ($(this).is(':checked')) {
      service.publish(CDO.createResponder(),
                      connectedScopeId,
                      mediaType, {})
    } else {
      service.unpublish(CDO.createResponder(),
                        connectedScopeId,
                        mediaType)
    }


  };
}

/**
 * Further configures, the plugin - creates service and initializes devices.
 */
function startPlugin() {
  log_d("Starting the plug-in");
  $('#installButton').hide();
//  Create and configure listener
  var listener = new CDO.CloudeoServiceListener();
  listener.onUserEvent = function (/**CDO.UserStateChangedEvent*/e) {
    if (e.isConnected) {
      newUser(e);
    } else {
      userGone(e);
    }
  };
  listener.onMediaStreamEvent = function(e){
    log_d("Got new media stream event: " + JSON.stringify(e));
    if(e.mediaType !== CDO.MEDIA_TYPE_VIDEO) {
//      Ignore other event types.
      return;
    }
    if(e.videoPublished) {
//      User just published the video feed
      newUser(e);
    } else {
//      User just stoped publishing the video feed
      userGone(e);
    }
  };

//  Create the CloudeoService
  plugin.createService(CDO.createResponder(function (result) {
    service = /**CDO.CloudeoService*/ result;
    service.addServiceListener(CDO.createResponder(), listener);
    initVideo();
    initAudio();
  }));
}


/**
 * Initializes audio subsystem:
 * - fetches microphones and speakers
 * - selects first mic and fisrt speaker to be used by the Cloudeo Service
 */
function initAudio() {
  log_d("Initializing the audio subsystem");
  log_d("Getting audio capture devices");

//  Initialize microphones
  service.getAudioCaptureDeviceNames(
      CDO.createResponder(function (devs) {
        log_d("Got audio capture devices: " + JSON.stringify(devs));
        log_d("Using audio capture device: " + devs[0]);
        if (devs.length > 0) {
          service.setAudioCaptureDevice(CDO.createResponder(function () {
            log_d("Audio capture device configured");
          }), 0);
        }
      }));
  log_d("Getting audio output devices");

//  Initialize speakers
  service.getAudioOutputDeviceNames(
      CDO.createResponder(function (devs) {
        log_d("Got audio output devices: " + JSON.stringify(devs));
        log_d("Using audio output device: " + devs[0]);

        if (devs.length > 0) {
          service.setAudioOutputDevice(CDO.createResponder(
              function () {
                log_d("Audio output device configured");
              }
          ), 0);
        }
      }));
}

/**
 * Initializes video devices:
 * - fetches device list
 * - fills the web cam selection combo
 * - selects last device from the list
 * - configures change event listener on the webcam combo, to allow switching
 *   between devices.
 */
function initVideo() {
  log_d("Initializing the video subsystem");

  var setVideoDev = function (devs) {
    log_d("Got video capture devices: " + JSON.stringify(devs));
    var dev = '';
    $.each(devs, function (k, v) {
      dev = k;
      $('#webcamsSelect').append($('<option value="' + k + '">' + v + '</option> '));
    });
    if (dev) {
      log_d("Using video capture device: " + JSON.stringify(devs[dev]));
      window.configuredDevice = dev;
      service.setVideoCaptureDevice(CDO.createResponder(startLocalPreview), dev);
    } else {
      log_e("None video capture devices installed.");
    }
  };
  log_d("Getting video capture devices");
  service.getVideoCaptureDeviceNames(CDO.createResponder(setVideoDev));

}

/**
 * Starts local preview of the user:
 * - requests the service to start capturing local user's video feed from
 * selected webcam
 * - upon successful result, initializes the renderer.
 */
function startLocalPreview() {
  log_d("Starting local video");
  $('#webcamsSelect').val(window.configuredDevice);
  var succHandler = function (sinkId) {
    window.localPreviewStarted = true;
    log_d("Local video started. Setting up renderer");
    var rendererContent = RENDER_LOCAL_TMPL.replace('#', '_local');
    $('.feeds-wrapper').append($(rendererContent));
    CDO.renderSink(sinkId, 'userFeed_local');
  };
  service.startLocalVideo(CDO.createResponder(succHandler));
}

/**
 * Tries to perform plugin self-update.
 */
function tryUpdatePlugin() {
  var updateListener = {};
  updateListener.updateProgress = function (value) {
    log_d("Got update progress: " + value);
  };

  updateListener.updateStatus = function (eventType, errCode, errMessage) {
    log_d("Got update event type: " + eventType);
    switch (eventType) {
      case 'UPDATING':
//          Update process started
        break;
      case 'UPDATED':
//        Plugin updated
        startPlugin();
        break;
      //noinspection FallthroughInSwitchStatementJS
      case 'UP_TO_DATE':
//        Plugin up to date - nothing needs to be done
        startPlugin();
        break;
      case 'UPDATED_RESTART':
//        Plugin updated successfully but browser needs to be restarted
        break;
      case 'NEEDS_MANUAL_UPDATE':
//        Plugin needs reinstallation
        break;
      case 'ERROR':
//        Failed to update the plugin.
        break;
      default:
        break;
    }
  };
  plugin.update(updateListener)
}

/**
 * Shows install button in case the plugin isn't installed.
 */
function showInstallFrame() {
  log_d("Plugin not installed. Use install plugin button. Refresh the page when complete");
  CDO.getInstallerURL(CDO.createResponder(function (url) {
    $('#installButton').
        attr('href', url).
        show().
        click(pollForPlugin);
  }));
}

function pollForPlugin() {
  plugin.startPolling(startPlugin);
}

/**
 * =====================================================================
 * =====================================================================
 */

/**
 * Connects to scope with given id
 *
 * @param scopeId
 */
function connect(scopeId) {
  log_d("Trying to connect to media scope with id: " + scopeId);
  var connDescr = $.extend({}, CONNECTION_DESCRIPTOR);
  connDescr.autopublishAudio = $('#publishAudioChckbx').is(':checked');
  connDescr.autopublishVideo = $('#publishVideoChckbx').is(':checked');
  connDescr.token = (Math.floor(Math.random() * 10000)) + '';
  connDescr.url += scopeId;
  var succHandler = function () {
    log_d("Successfully connected");
    connectedScopeId = scopeId;
  };
  var errHandler = function (code, msg) {
    log_e("Failed to connect due to: " + msg + " (" + code + ")");
  };
  service.connect(CDO.createResponder(succHandler, errHandler), connDescr);
}

/**
 * Terminates previously established connection.
 */
function disconnect() {
  service.disconnect(CDO.createResponder(function () {
    $('.remote-feed').remove();
  }), connectedScopeId);
}

/**
 *
 * New user handler - renders remote user's video feed.
 * @param {CDO.UserStateChangedEvent} details
 */
function newUser(details) {
  log_d("Got new user with details: " + JSON.stringify(details));
  if (details.videoPublished) {
    var rendererContent = RENDER_TMPL.replace('#', details.userId);
    $('.feeds-wrapper').append($(rendererContent));
    CDO.renderSink(details.videoSinkId, 'userFeed' + details.userId);
  }
}

/**
 * User left handler - removes the remote user renderer.
 * @param details
 */
function userGone(details) {
  log_d("Got user left for user with details: " + JSON.stringify(details));
  $('#userFeed' + details.userId).html('').remove();
}


/**
 * Logging
 * @param msg
 */
function log_d(msg) {
  //noinspection StringLiteralBreaksHTMLJS
  $('<li>' + msg + '</li>').appendTo($('#logContainer'))

}

function log_e(msg) {
  //noinspection StringLiteralBreaksHTMLJS
  $('<li class="error">' + msg + '</li>').appendTo($('#logContainer'))

}