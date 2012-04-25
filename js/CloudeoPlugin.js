/*
 * Copyright (C) SayMama Ltd 2011
 *
 * All rights reserved. Any use, copying, modification, distribution and selling
 * of this software and it's documentation for any purposes without authors'
 * written permission is hereby prohibited.
 * 
 *============================================================================
 * Scripts for embedding and initializing Cloudeo Plug-In
 *============================================================================
 */

//noinspection JSUnusedAssignment
/**
 *============================================================================
 *                             Error Codes
 *============================================================================
 */

var PluginErrorCodes = {
  COMMON:{
    /**
     * Indicates that no error occured. This is used internally only.
     */
    SMERR_NO_ERROR:0,

    /**
     * Indicates that general failure has occured - situation not expected by
     * plug-in developers at all.
     *
     * This can be caused by:
     * - anything
     *
     * JS-client could try to recover by:
     * - there is no generic way to recover
     */
    SMERR_DEFAULT_ERROR:-1
  },

  CloudeoLogicErrorCodes:{
    SMERR_LOGIC_BASE:1000,
    /**
     * Indicates that JS-client tried to perform operation on plug-in in context
     * of non-existent connection.
     *
     * This can be caused by:
     * - performing various tasks twice (e.g. disconnect)
     * - performing various tasks in invalid order (e.g. set volume before
     *   connect)
     * - performing task after disconnecting
     *
     * JS-client could try to recover by:
     * - there is no generic way to recover, all depends on context but in most cases, this
     *   error can be simply 'eaten'
     */
    SMERR_LOGIC_INVALID_ROOM:1001, /* 1001*/

    /**
     * Indicates that JS-client tried to perform operation providing invalid
     * input parameters
     *
     * This can be caused by:
     * - invalid usage of API exposed by plugin.
     *
     * JS-client could try to recover by:
     * - There is no runtime recovery.
     */
    SMERR_LOGIC_INVALID_ARGUMENT:1002, /* 1002*/

    /**
     * Indicates that JS-client tried to pass to the plugin incorrect parameter key
     *
     * This can be caused by:
     * - plugin component does not know how to react on a passed key-value pair
     *
     * JS-client could try to recover by:
     * - there is no generic way to recover, all depends on context but in most cases, this
     *   error can be simply swallowed
     */
    SMERR_LOGIC_INVALID_JS_PARAMETER_KEY:1003, /* 1003*/

    /**
     * Indicates that there was unknown, fatal error during platform initialization
     *
     * This can be caused by:
     * - failed to initialize com model on windows
     *
     * JS-client could try to recover by:
     * - there is no way to recover. JS-client must show the user error message, requesting
     *   to restart the browser.
     */
    SMERR_LOGIC_PLATFORM_INIT_FAILED:1004, /* 1004*/

    /**
     * Indicates that client tried to create service while plug-in is updating
     *
     * This can be caused by:
     * - trying to create service while plug-in is auto uptdating.
     *
     * JS-client could try to recover by:
     * - it's rather bug in JS-client code.
     *
     */
    SMERR_LOGIC_PLUGIN_UPDATING:1005, /* 1005 */

    /**
     * Indicates that there was unknown, fatal error during plugin working
     *
     * This can be caused by:
     * - unhandled exception in the plugin code
     *
     * JS-client could try to recover by:
     * - there is no way to recover. JS-client must show the user error message, requesting
     *   to restart the browser.
     */
    SMERR_LOGIC_INTERNAL:1006, /* 1006 */

    /**
     * Indicates that plugin container couldn't load logic library, most likely because it is running in
     * Windows Low Integrity mode (less privileged) and the lib is already loaded by process that runs in medium
     * integrity mode (more privileged)
     *
     * This can be caused by:
     * - Cloudeo used by user in 2 browsers in same time. The first browser launched was non-IE, the second
     * (the one where error is reported) is IE
     *
     * JS-client could try to recover by:
     * - JS-client must show to the user dialog asking to close other browser or use the other browser
     */
    SMERR_LOGIC_LIB_IN_USE:1007, /* 1007 */

    /**
     * Indicates that logic library cannot communicate with plugin container, because it's too old. This error will be
     * return in response to createService request. From JS-user point of view, it means that there should be restart
     * of a browser after update, but user hasn't done that
     *
     * This can be caused by:
     * - Browser hasn't been restarted after update that required it
     *
     * JS-client could try to recover by:
     * - JS-client must show to the user dialog asking to reload the browser
     */
    SMERR_LOGIC_INVALID_CONTAINER_VERSION:1008 /* 1008 */
  },

  CloudeoCommunicationErrorCodes:{
    /**
     * Indicates that plugin were trying to connect to streaming server, but
     * cannot find given host (cannot resolve host with given IP/domain
     * address)
     *
     * This can be caused by:
     * - core server provided invalid call URL
     * - streamer server is down (temporarily).
     *
     * JS-client could try to recover by:
     * - reestablishing a call with new streaming server (box)
     */
    SMERR_COMM_INVALID_HOST:2001,

    /**
     * Indicate that plugin was unsuccessful with connect attempt. It managed
     * to resolve host address and connect to it, so streaming (box) is running,
     * but it couldn't connect to streamer application.
     *
     * This can be caused by:
     * - streaming application listening on given port is down
     * - user cannot communicate with it due to firewall
     * - there is configuration error in core server, so server gives URL to
     *   streamer with valid host name, but invalid port
     * - somehow, we have error in configuration and there are ports blocked on
     *   server side
     *
     * JS-client could try to recover by:
     * - reestablishing a call with new streaming server (application)
     */
    SMERR_COMM_INVALID_PORT:2002,

    /**
     * Plugin tried to connect to streamer server, established communication
     * channel, but credentials provided by JS-client were rejected by it.
     *
     * Can be caused by:
     * - invalid credentials used by JS-client (JS-client application bug)
     * - session timeout on core server
     *
     * JS-client could try to recover by:
     * - no recovery
     *
     */
    SMERR_COMM_BAD_AUTH:2003,

    /**
     * Plugin tried to connect to streamer server, established communication
     * channel, but there was internal error on streamer side that prevented it
     * from successful authentication. It DOESN'T mean that credentials were
     * invalid.
     *
     * Can be caused by:
     * - streamer side bug
     * - error in protocol
     *
     * JS-client could try to recover by:
     * - reestablishing a call with new streaming server (application)
     */
    SMERR_COMM_AUTH_ERROR:2004,

    /**
     * Plugin tried to connect to streamer server, established management
     * communication link, but multimedia communication link failed, so there
     * is no way to transmit media data.
     * This error code can be used before OR after successful connection. When
     * triggered after successful connection, it indicates that media
     * connection was lost.
     *
     * Can be caused by:
     * - firewall blocking streaming traffic
     * - link failure
     *
     * JS-client could try to recover by:
     * - no recovery when triggered before successful connection
     * - reestablishing call if triggered during call. It might be because
     *   link failure near to streamer, so using different streamer may help
     *   here (rather impossible)
     *
     */
    SMERR_COMM_MEDIA_LINK_FAILURE:2005,

    /**
     * Indicates that plug-in lost management connection to streaming server.
     * This error code will be used to notify about error only after successful
     * CONNECT.
     *
     * Can be caused by:
     * - streaming server (application) was closed/killed or crashed
     * - streaming server (box) died
     * - communication link was terminated
     *
     * JS-client could try to recover by:
     * - reestablishing a call with new streaming server (box) - will help if
     *   error was caused by first 2 possible cases
     *
     */
    SMERR_COMM_REMOTE_END_DIED:2006,


    /**
     * Indicates that plug-in couldn't connect to streaming server due to
     * internal, unknown and unexpected error.
     *
     * Can be caused by:
     * - bug in plug-in code
     *
     * JS-client could try to recover by:
     * - reestablishing a call
     */
    SMERR_COMM_INTERNAL:2007,


    SMERR_SEND_INVALID_ARGUMENT:2008,
    /**
     * Streamer rejected connection request because user with given id already
     * joined given room
     *
     * Can be caused by:
     * - User trying to join same room twice (e.g. in 2nd tab)
     *
     * JS-client could try to recover by:
     * - show notification asking to disconnect other connection
     */
    SMERR_COMM_ALREADY_JOINED:2009
  },
  CloudeoMediaErrorCodes:{
    /**
     * Indicates that currently configured (setVideoCaptureDevice) video capture
     * device (webcam) is invalid and cannot be used by Plug-In
     *
     * This can be caused by:
     * - setVideoCaptureDevice called with invalid index
     * - startLocalPreview, connect called with invalid camera configured
     *
     * JS-client could try to recover by:
     * - selecting different video capture device
     * - not using video (don't publish video in connect)
     */
    SMERR_MEDIA_INVALID_VIDEO_DEV:4001,

    /**
     * Indicates that audio capture device (microphone) haven't been configured
     * using setAudioCaptureDevice, but there is attempt to make a call with
     * audio published.
     *
     * This can be caused by:
     * - invalid order of calls - trying to call connect with published audio
     *   before setting audio capture device
     *
     * JS-client could try to recover by:
     * - set audio capture device
     */
    SMERR_MEDIA_NO_AUDIO_IN_DEV:4002,

    /**
     * Indicates that given audio capture device is invalid. May be thrown
     * with setAudioCaptureDevice or setAudioOutputDevice.
     *
     * This can be caused by:
     * - call to setAudioCaptureDevice with invalid index (less than 0 or
     *   greater than amount of audio capture devices installed)
     * - call to setAudioCaptureDevice with device that is incompatible and
     *   can't be used
     * - call to setAudioOutputDevice, where capture device previously
     *   configured was unplugged in the meantime and getAudioCaptureDeviceNames
     *   was called. It's because initialization of audio device is always in
     *   pair - when setting audio output device, also audio capture device gets
     *   initialized
     *
     * JS-client could try to recover by:
     * - set different audio capture device
     * - call getAudioCaptureDeviceNames to refresh list of devices
     */
    SMERR_MEDIA_INVALID_AUDIO_IN_DEV:4003,

    /**
     * Indicates that given audio output device is invalid. May be thrown
     * with setAudioOutputDevice or setAudioCaptureDevice.
     *
     * This can be caused by:
     * - call to setAudioOutputDevice with invalid index (less than 0 or
     *   greater than amount of audio capture devices installed)
     * - call to setAudioOutputDevice with device that is incompatible and
     *   can't be used
     * - call to setAudioCaptureDevice, where output device previously
     *   configured was unplugged in the meantime and getAudioOutputDeviceNames
     *   was called. It's because initialization of audio device is always in
     *   pair - when setting audio output device, also audio capture device gets
     *   initialized
     *
     * JS-client could try to recover by:
     * - set different audio capture device
     * - call getAudioOutputDeviceNames to refresh list of devices
     */
    SMERR_MEDIA_INVALID_AUDIO_OUT_DEV:4004,

    /**
     * Indicates that either audio output or capture device initialization
     * failed and plugin cannot differ or that given audio capture and output
     * devices are for some reason incompatible (e.g. there is no common
     * sampling resolution when using Juce audio)
     *
     * This can be caused by:
     * - call to setAudioCaptureDevice with invalid devices
     * - call to setAudioOutputDevice with invalid devices
     *
     *
     * JS-client could try to recover by:
     * - set different audio capture or output device
     */
    SMERR_MEDIA_INVALID_AUDIO_DEV:4005,

    /**
     * Indicates that plugin was unable to create and initialize virtual camera.
     *
     * This can be caused by:
     * - cannot initialise/open IPC or all vcams are in use
     *
     * JS-client could try to recover by:
     * - if IPC fails it's a critical error in vcams
     */
    SMERR_MEDIA_VCAM_INIT_FAILED:4006

  },

  CloudeoInstallationErrorCodes:{
    SMERR_INST_BASE:5000,

    /**
     * Indicates that plugin is already installing
     *
     * This can be caused by:
     * - calling installPlugin 2nd time prior to receiving error or install progress 100%
     *
     * JS-client could try to recover by:
     * - ???
     */
    SMERR_INST_ALREADY_INSTALLING:5001, /*= 5001*/

    /**
     * Indicates that plugin installer failed to spawn installation process on windows
     *
     * This can be caused by:
     * - calling installPlugin 2nd time prior to receiving error or install progress 100%
     *
     * JS-client could try to recover by:
     * - ???
     */
    SMERR_INST_FAILED_TO_SPAWN_INST:5002, /*= 5002*/

    /**
     * Indicates that operation on given platform is unsupported - like calling kill flash chrome if running on win
     *
     * This can be caused by:
     * - see above
     *
     * JS-client could try to recover by:
     * - don't do unsupported stuff
     */
    SMERR_INST_UNSUPPORTED:5003, /*= 5003*/

    /**
     * Indicates that installer failed to write installation files
     *
     * This can be caused by:
     * - see above
     *
     * JS-client could try to recover by:
     * - Just show some failure message, try manual installation.
     */
    SMERR_INST_IO_ERROR:5004, /*= 5004 */

    /**
     * Indicates that installer or updater failed to download installation/update bundle.
     *
     * This can be caused by:
     * - see above
     *
     * JS-client could try to recover by:
     * - Perform manual installation or just skip updating.
     *
     */
    SMERR_INST_DOWNLOAD_ERROR:5005, /*= 5005 */

    /**
     * Indicates that verification of downloaded data is failed
     *
     * This can be caused by:
     * - see above
     *
     * JS-client could try to recover by:
     * - Perform manual installation or just skip updating.
     *
     */
    SMERR_INST_DATA_VERIFICATION_ERROR:5006 /*= 5006 */

  }
};

/**
 *============================================================================
 *                             PluginWrapper
 *============================================================================
 */
function PluginWrapper(configuration) {
  this.mimeType = configuration.mimeType;
  this.classId = configuration.classId;
  this.testMethod = configuration.testMethod;
  this.POLL_INTERVAL = 500;
  this.objectId = generateObjectTagId();
  this.params = {};
  this.attributes = {};
  this.polling = false;
  this.width = 0;
  this.height = 0;
}


/**
 *  Initializes process of polling for plugin
 */
PluginWrapper.prototype.startPolling = function (handler) {
  log_d("[PluginWrapper] Starting polling for plugin of type: " +
            this.mimeType);
  this.pollingHandler = handler;
  if (this.polling) {
    log_d("[PluginWrapper] Polling already started. " +
              "Just updated handler");
    return;
  }
  this.polling = true;
  this.startPollingInternal();
};

/**
 *  Initializes process of polling for plugin
 */
PluginWrapper.prototype.startPollingInternal = function () {

  var self = this;
  this.pollingTimer = setTimeout(function () {
    self.pollForPlugin(self.callbackHandler);
  }, this.POLL_INTERVAL);
};

//noinspection JSUnusedGlobalSymbols
/**
 *  Stops process of polling for plugin
 */
PluginWrapper.prototype.stopPolling = function () {
  clearTimeout(this.pollingTimer);
};


/**
 * Checks whether plugin can be loaded, sets timer if it fails
 */
PluginWrapper.prototype.pollForPlugin = function () {
  log_d("[PluginWrapper] Polling for plugin...");
  var loadStatus = this.loadPlugin();
  if (loadStatus) {
    log_d("[PluginWrapper] Plugin loaded, notyfing listener");
    this.pollingHandler()
  } else {
    log_d("[PluginWrapper] failed to load the plugin, retrying");
    this.startPollingInternal()
  }
};

/**
 *  Tries  to load plugin, by embeding object tag
 */
PluginWrapper.prototype.loadPlugin = function () {
  log_d("[PluginWrapper] Trying to embed plugin");
  try {
    navigator.plugins.refresh(false);
  } catch (e) {
    log_d("Failed to refresh " + e)
  }
  if (!this.pluginInstalled()) {
    log_d("[PluginWrapper] Pre load tests shows that plugin isn't " +
              "installed. Skipping");
    return false;
  }
  log_d("[PluginWrapper] Setting up OBJECT tag, tag id: " + this.id);
  if (this.mimeType.substr) {
    this.succMimeType = this.mimeType;
    return this._loadByMime(this.mimeType);
  } else {
    for (var i = 0; i < this.mimeType.length; i++) {

      var result = this._loadByMime(this.mimeType[i]);
      if (result) {
        this.succMimeType = this.mimeType[i];
        return result;
      }
    }
  }
  return result;
};

PluginWrapper.prototype._loadByMime = function (mimeType) {
  var pluginContainerId = this.pluginContainerId;
  if (!pluginContainerId) {
    log_e("[PluginWrapper] Cannot embed plugin: pluginContainerId " +
              "was not specified");
    return false;
  }
  var attrString = "";
  $.each(this.attributes, function (k, v) {
    attrString += k + '="' + v + '" ';
  });

  var tagContent = '<object type="' + mimeType + '" width="' +
      this.width + '" height="' + this.height + '" id="' +
      this.objectId + '" ' + attrString + '>';
  $.each(this.params, function (k, v) {
    tagContent += '<param name="' + k + '" value="' + v + '"/>';
  });
  //noinspection StringLiteralBreaksHTMLJS
  tagContent += '  </object>';
  log_d("[PluginWrapper] Resetting innerHTML of container");
  $('#' + pluginContainerId).html('').html(tagContent);
  log_d("[PluginWrapper] OBJECT tag added to DOM. Testing for" +
            " method: " + this.testMethod);

  this.pluginInstance = document.getElementById(this.objectId);
  var result = (this.testMethod === null
      || this.testMethod in this.pluginInstance);
  if (!result) {
    log_d("[PluginWrapper] Plugin " + this.mimeType +
              " seems not to be installed")
  }
  return result;
};
/**
 *  Tries  to unload plugin, by removing object tag
 */
PluginWrapper.prototype.unload = function () {
  log_d("[PluginWrapper] Trying to unload plugin");
  var pluginContainerId = this.pluginContainerId;
  if (!pluginContainerId) {
    log_e("[PluginWrapper] Cannot unload plugin: pluginContainerId " +
              "was not specified");
    return false;
  }
  log_d("[PluginWrapper] Removing OBJECT tag, tag id: " + this.id);
  $('#' + this.pluginContainerId).html('');
  log_d("[PluginWrapper] OBJECT tag removed from DOM");
};

/**
 * ============================================================
 * Main initialization function.
 * ============================================================
 */

PluginWrapper.prototype.pluginInstalled = function () {
  /**
   *  Mock implementation override to for fine tune check
   */
  if ($.browser.webkit || $.browser.mozilla) {
    var installed = false;
    var self = this;
    $.each(window.navigator.plugins, function (k, plugin) {
      $.each(plugin, function (k2, mimeType) {
        if (mimeType.type == self.mimeType) {
          installed = true;
        }
      });
    });
    return installed;
  } else {
    return true;
  }

};

/**
 *============================================================================
 *                                      CloudeoPlugin
 *============================================================================
 */


/**
 * Saymama wrapping object.
 *
 * @param pluginContainerId - id of the HTML element where plugin OBJECT tag
 *                            should be embedded. This element must be
 *                            statically defined in the DOM (i.e. it cannot be
 *                            appended dynamically with JavaScript).
 */
function CloudeoPlugin(pluginContainerId) {
  if ($('#' + pluginContainerId).length === 0) {
    throw('Invalid plugin container id - element with given id doesn\'t exist');
  }
  this.pluginContainerId = pluginContainerId;
}

var SAYMAMA_PLUGIN_CONFIG = {
  mimeType:"application/x-cloudeoplugin",
  classId:"clsid: 051e3002-6ebb-5b93-9382-f13f091b2ab2",
  testMethod:"createService"
};

CloudeoPlugin.prototype = new PluginWrapper(SAYMAMA_PLUGIN_CONFIG);
CloudeoPlugin.prototype.constructor = CloudeoPlugin;


/**
 * ============================================================
 * Delegates to container
 * ============================================================
 */

CloudeoPlugin.prototype.createService = function (responder) {
  log_d("[CloudeoPlugin] Creating new plugin service instance");
  this.pluginInstance.createService(responder);
};


CloudeoPlugin.prototype.update = function (responder, url) {
  log_d("[CloudeoPlugin] Updating plugin");
  this.pluginInstance.update(responder, url);
};


CloudeoPlugin.prototype.revalidate = function () {
  log_d("[CloudeoPlugin] Revalidating plugin");
  this.pluginInstance.revalidate();

};

CloudeoPlugin.prototype.invalidate = function () {
  log_d("[CloudeoPlugin] Invalidating plugin");
  this.pluginInstance.invalidate();
};

CloudeoPlugin.prototype.getLogFileTag = function () {
  log_d("[CloudeoPlugin] Retrieving container log file tag");
  if (this.pluginInstance.getLogFileTag === undefined) {
    return undefined;
  }
  return this.pluginInstance.getLogFileTag();
};

CloudeoPlugin.prototype.getLogFileByTag = function (tag) {
  log_d("[CloudeoPlugin] Retrieving log file by tag " + tag);
  if (this.pluginInstance.getLogFileByTag === undefined) {
    return '';
  }
  return this.pluginInstance.getLogFileByTag(tag);
};


function generateObjectTagId() {
  var text = "plugin_";
  var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
