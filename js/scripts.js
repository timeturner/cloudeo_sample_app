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

var plugin = false;

var RENDER_TMPL =
    '<object type="application/x-cloudeoplugin" vcamId="#"><property name="vcamId" value="#"/></object>';

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

function initPlugin() {
  log_d("Initializing the plug-in");
  plugin = new CloudeoPlugin(PLUGIN_CONTAINER_ID);
  var loadStatus = plugin.loadPlugin();
  if (loadStatus) {
//    Plugin is installed
    tryUpdatePlugin();
  } else {
//    Plugin requires installation
    showInstallFrame();
  }
}

function startPlugin() {
  log_d("Starting the plug-in");
  plugin.createService(r(function (service) {
    PluginServiceWrapper.setService(service);
    PluginServiceWrapper.addPluginListener(r(), PluginServiceListener.createInstance());
    initVideo();
    initAudio();
  }));
}

function initAudio() {
  log_d("Initializing the audio subsystem");
  log_d("Getting audio capture devices");
  PluginServiceWrapper.getAudioCaptureDeviceNames(
      r(function (devs) {
        log_d("Got audio capture devices: " + JSON.stringify(devs));
        log_d("Using audio capture device: " + devs[0]);
        if (devs.length > 0) {
          PluginServiceWrapper.setAudioCaptureDevice(r(function () {
            log_d("Audio capture device configured");
          }), 0);
        }
      }));
  log_d("Getting audio output devices");
  PluginServiceWrapper.getAudioOutputDeviceNames(
      r(function (devs) {
        log_d("Got audio output devices: " + JSON.stringify(devs));
        log_d("Using audio output device: " + devs[0]);

        if (devs.length > 0) {
          PluginServiceWrapper.setAudioOutputDevice(r(
              function () {
                log_d("Audio output device configured");
              }
          ), 0);
        }
      }));
}

function initVideo() {
  log_d("Initializing the video subsystem");
  var setVideoDev = function (devs) {
    log_d("Got video capture devices: " + JSON.stringify(devs));
    var dev;
    $.each(devs, function (k, v) {
      dev = k;
    });
    if (dev) {
      log_d("Using video capture device: " + JSON.stringify(devs[dev]));
      PluginServiceWrapper.setVideoCaptureDevice(r(startLocalPreview), dev);
    } else {
      log_e("None video capture devices installed.");
    }
  };
  log_d("Getting video capture devices");
  PluginServiceWrapper.getVideoCaptureDeviceNames(r(setVideoDev));

}

function startLocalPreview() {
  log_d("Starting local video");
  var succHandler = function (rendererId) {
    log_d("Local video started. Setting up renderer");
    var objectContent = RENDER_TMPL.replace('#', rendererId);
    $('#localVideoWrapper').html('').html(objectContent)
  };
  PluginServiceWrapper.startLocalVideo(r(succHandler), 320, 240);
}


function tryUpdatePlugin() {
  function onUpdateProgress(value) {
  }

  function onUpdateStatus(eventType, errCode, errMessage) {
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
  }


  plugin.update({
                  updateProgress:onUpdateProgress,
                  updateStatus:onUpdateStatus
                }, getUpdateDescrUrl())
}

function showInstallFrame() {
  getDescriptor(function (descr) {
//    TODO fill the install URLS
  });
}


function getDescriptor(responder) {
  var url = getUpdateDescrUrl();
  $.get(url, function (data) {
    var descriptor = {};
    $.each(data.split('\n'), function (k, v) {
      if (!v.match(/^ *#/)) {
        var propItems = v.split('=');
        descriptor[propItems[0]] = propItems[1];
      }
    });
    responder(descriptor);
  });
}

function getUpdateDescrUrl() {
  var url = UPDATE_DESCR_BASE;
  if (window.navigator.userAgent.match(/Windows/)) {
    url += 'win';
  } else {
    url += 'mac';
  }
  return url;
}

function r(resultHandler, errHandler, context) {
  if (context === undefined) {
    context = new Object();
  }
  if (errHandler === undefined) {
    errHandler = $.noop;
  }
  if (resultHandler === undefined) {
    resultHandler = $.noop;
  }
  context.result = resultHandler;
  context.error = errHandler;
  return context;
}

/**
 * =====================================================================
 * =====================================================================
 */

/**
 *
 * @param roomId
 */
function connect(roomId) {
  log_d("Trying to connect to media scope with id: " + roomId);
  var connDescr = $.extend({}, CONNECTION_DESCRIPTOR);
  connDescr.token = (Math.floor(Math.random() * 10000)) + '';
  connDescr.url += roomId;
  var succHandler = function () {
    log_d("Successfully connected");
  };
  var errHandler = function (code, msg) {
    log_e("Failed to connect due to: " + msg + " (" + code + ")");
  };
  PluginServiceWrapper.connect(r(succHandler, errHandler), connDescr);
}

function newUser(details) {
  log_d("Got new user with details: " + JSON.stringify(details));
  var objectContent = RENDER_TMPL.replace('#', details.vcamId);
  $('#remoteVideoWrapper').html('').html(objectContent)
}

function userGone(details) {
  log_d("Got user left for user with details: " + JSON.stringify(details));
  $('#remoteVideoWrapper').html('')
}

function log_d(msg) {
  $('<li>' + msg + '</li>').appendTo($('#logContainer'))

}

function log_e(msg) {
  $('<li class="error">' + msg + '</li>').appendTo($('#logContainer'))

}