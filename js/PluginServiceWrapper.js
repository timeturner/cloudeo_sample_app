/**
 * Copyright (C) SayMama Ltd 2011
 *
 * All rights reserved. Any use, copying, modification, distribution and selling
 * of this software and it's documentation for any purposes without authors' written
 * permission is hereby prohibited.
 *
 *
 * Contains implementation of the PluginServiceWrapper object.
 *
 * @author Tadeusz Kozak
 * @date: 9/20/11 2:29 PM
 *
 */

/**
 * Module that wraps the SayMama Plugin service. It contains full plugin service
 * API definition, as well as additional
 * 
 *
 */
var PluginServiceWrapper = (function () {

  var AUDIO_SETTINGS_PFX = "global.dev.audio.";

//    Scope variables
  var service = {};

//    Public API


  function setService(serviceToBeSet) {
    service = serviceToBeSet;
  }

  /**
   * Returns a version of Plug-In currently used.
   *
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return string containing version number in form N.N.N.N.
   *         Example result:
   *         "1.14.0.107"
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function getVersion(responder) {
    log.d("Getting service version");
    
    service.getVersion(responder);
    return true;
  }

  /**
   * Sets the notification handler that is used when dispatching asynchronous
   * events to the browser.
   *
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param listener object to receive notifications.
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function addPluginListener(responder, listener) {



    if (service.addSayMamaPluginListener) {
      service.addSayMamaPluginListener(responder, listener);
    } else {
      service.addCloudeoPluginListener(responder, listener);
    }
    return true;
  }

  /**
   * Returns a list of video capture devices plugged in to the user's computer.
   * The ids of devices returned by this function should be used when
   * configuring the video capture device. Note that the device ids return by
   * this method are permanently associated with given device. It means, that
   * it is possible to store id of device selected by the user and reuse it
   * across multiple sessions.
   *
   * @see setVideoCaptureDevice(),
   *      getVideoCaptureDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return a javascript object, dictionary whose keys should be used as
   *         device ids and values as human-readable labels.
   *         Example result:
   * {
   *   "a3d3184172d2eb9d38797d801348744ea22cb71b":"USB 2.0 Camera",
   *   "bda5ea04b3813b906540f967fed4fe17a566f2e1":"Logitech HD Webcam C510"
   * }
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_VIDEO_DEV (4001)
   *   May happen if there were errors on listing the devices on the OS-level.
   *   This may happen on OSX if there aren't any video devices plugged in or
   *   all devices are in use by other application
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function getVideoCaptureDeviceNames(responder) {






    service.getVideoCaptureDeviceNames(responder);
    return true;
  }

  /**
   * Sets the video capture device to be used. This method should be used
   * nevertheless the video capture device is used or not. It sets the device
   * globally in scope of the underlying Plug-in service.
   *
   * Once set, the selected device will be used for local preview and publishing
   * video stream to all rooms to which user is connected. It is also possible
   * to change the video device while in use. User just may experience short
   * video freeze during the change.
   *
   * In case of error during device setup, the service will try to fall back
   * to previously functional device.
   *
   * @see getVideoCaptureDeviceNames(),
   *      getVideoCaptureDevice()
   *      startLocalVideo(),
   *      connect()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param deviceId id of video device (corresponding to device id returned by
   *                 getVideoCaptureDeviceNames())
   * @return undefined.
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_VIDEO_DEV (4001)
   *   This error code may indicate that:
   *   - the specified device id is either invalid (device with given id
   *     isn't plugged in at the moment of calling this method
   *    Plug-in failed to initialize the device. It may be either because the
   *    device is in use by different application or simply stopped working
   *
   *  - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function setVideoCaptureDevice(responder, deviceId) {
    service.setVideoCaptureDevice(responder, deviceId);
    return true;
  }


  /**
   * Returns the currently configured video device.
   *
   * @see getVideoCaptureDeviceNames(),
   *      setVideoCaptureDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return id of currently selected video capture device (corresponding to
   *         device id returned by getVideoCaptureDeviceNames()) or an empty
   *         string if no device was configured previously.
   *         Example result:
   *         "a3d3184172d2eb9d38797d801348744ea22cb71b"
   *
   * Possible errors:
   *
   *  - SMERR_DEFAULT_ERROR (-1)
   *    if an unexpected, internal error occurs
   **/
  function getVideoCaptureDevice(responder) {



    service.getVideoCaptureDevice(responder);
    return true;
  }


  /**
   * Returns a list of audio capture devices (microphones) plugged in to the
   * user's computer at the moment of call. The result is a JavaScript array
   * object, with human friendly device labels as values. Indexes of the
   * resulting array are to be used when configuring audio capture device.
   *
   * It is not guaranteed that indexes of devices are permanent across multiple
   * service sessions.
   *
   * @see setAudioCaptureDevice(),
   *      getAudioCaptureDevice(),
   *      getAudioOutputDeviceNames(),
   *      getVideoCaptureDeviceNames()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return list of audio capture devices connected to the system.
   *         Example result:
   *         [
   *            "Microphone (HD Webcam C510)",
   *            "Microphone (Realtek High Definition Audio)"
   *         ]
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_AUDIO_DEV (4005)
   *   In case of an error with getting the amount of the devices.
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function getAudioCaptureDeviceNames(responder) {



    service.getAudioCaptureDeviceNames(responder);
    return true;
  }


  /**
   * Configures the audio capture device (microphone) to be used by the service.
   *
   * @see getAudioCaptureDeviceNames(),
   *      getAudioCaptureDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param deviceId index of device in array returned by the
   *         getAudioCaptureDeviceNames() method
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_AUDIO_IN_DEV (4003)
   *   In case of invalid device index specified specified (less then 0, greater
   *   then the amount of devices installed) or if there were problem with
   *   enabling the device (e.g. device in use on Windows XP)
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function setAudioCaptureDevice(responder, deviceId) {


    service.setAudioCaptureDevice(responder, deviceId);

    return true;
  }


  /**
   * Returns the index of currently configured audio capture device (microphone)
   *
   * @see getAudioCaptureDeviceNames(),
   *      setAudioCaptureDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return the index of currently configured audio capture device (microphone)
   *          Example result:
   *          0
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function getAudioCaptureDevice(responder) {


    service.getAudioCaptureDevice(responder);

    return true;
  }


  /**
   * Returns a list of audio output devices (speakers, headphones) plugged in to
   * the user's computer at the moment of call. The result is a JavaScript array
   * object, with human friendly device labels as values. Indexes of the
   * resulting array are to be used when configuring the audio output device.
   *
   * It is not guaranteed that indexes of devices are permanent across multiple
   * service sessions.
   *
   * @see setAudioOutputDevice(),
   *      getAudioOutputDevice(),
   *      getAudioCaptureDeviceNames(),
   *      getVideoCaptureDeviceNames()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return list of audio capture devices connected to the system.
   *         Example result:
   *         [
   *            "Speaker/HP (Realtek High Definition Audio)"
   *            "Headset Earphone (Sennheiser DECT)"
   *         ]
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_AUDIO_DEV (4005)
   *   In case of an error with getting the amount of the devices.
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/

  function getAudioOutputDeviceNames(responder) {



    service.getAudioOutputDeviceNames(responder);
    return true;
  }


  /**
   * Configures the audio output device (speakers, microphone) to be used by
   * the service.
   *
   * @see getAudioOutputDeviceNames(),
   *      getAudioOutputDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param deviceId index of device in array returned by the
   *         getAudioOutputDeviceNames() method
   * @return undefined
   *
   * Possible errors:
   *   TODO fix this in the plugin!
   * - SMERR_MEDIA_INVALID_AUDIO_IN_DEV (4003)
   *   In case of invalid device index specified specified (less then 0, greater
   *   then the amount of devices installed) or if there were problem with
   *   enabling the device (e.g. device in use on Windows XP)
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   **/
  function setAudioOutputDevice(responder, deviceId) {



    service.setAudioOutputDevice(responder, deviceId);
    return true;
  }


  /**
   * Returns the index of currently configured audio output device.
   *
   * @see getAudioOutputDeviceNames(),
   *      setAudioOutputDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return the index of currently configured audio capture device (microphone)
   *          Example result:
   *          0
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function getAudioOutputDevice(responder) {



    service.getAudioOutputDevice(responder);
    return true;
  }


  /**
   * Starts previewing video stream of current user. It actually means, that
   * this methods:
   * - checks whether selected video capture device is enabled and captures
   *   frames. If not - enables it.
   * - checks whether local preview renderer is defined or not, if not -
   *   creates one and links it to the video capture device
   * - returns a string that can be used to render the live feed
   *
   * The string returned by this method, should be used to create video renderer
   * provided by the Cloudeo plugin, see _rendering_ for more details.
   *
   * Each subsequent call to the startLocalVideo uses same renderer and can be
   * used to effectively change the local preview resolution.
   *
   * The resolution params doesn't have any effect if user is connected with
   * video published, as in this case, the adaptation algorithm takes control
   * over the resolution. Also, the resolution specified while starting local
   * video should be treated only as a hint. Video renderers provided with
   * the Cloudeo plugin are capable of scaling and cropping the video to
   * maintain the desired aspect ratio and also fit to any space required by the
   * application UI. Also, the selected webcam must be capable of providing feed with
   * the desired resolution.
   *
   * @see stopLocalVideo()
   *      setVideoCaptureDevice()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param width width of capturing feed
   * @param height height of capturing feed
   * @returns string containing id of renderer to be used when displaying local
   *          preview live feed. Example result:
   *          "Cloudeo Adapter 0"
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   * - SMERR_MEDIA_VCAM_INIT_FAILED (4006)
   *   In case of error during renderer creation
   * - SMERR_MEDIA_INVALID_VIDEO_DEV
   *
   *
   * TODO in docs, move it to separte section
   * The video renderer can be created using
   * following object tag syntax:
   * <object class="local-preview" type="application/x-cloudeoplugin"
   *      vcamid="RENDERER_ID_RETURNED_BY_START_LOCAL_VIDEO">
   *      <param name="vcamid"
   *             value="RENDERER_ID_RETURNED_BY_START_LOCAL_VIDEO"/>
   * </object>
   *
   *
   *
   **/
  function startLocalVideo(responder, width, height) {


    service.startLocalVideo(responder, width, height);
    return true;
  }

  /**
   * Stops previewing local video feed of the user. Internally it frees all
   * resources needed to render the local preview and also releases the video
   * capture device if it's not used by any established connection.
   *
   * @see startLocalVideo()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function stopLocalVideo(responder) {



    service.stopLocalVideo(responder);
    return true;
  }

  /**
   * Establishes connection to the streaming server using given description.
   * This is the most important method of all provided by Cloudeo plug-in
   * service.
   *
   * Connection descriptor
   * =====================
   *
   * The only one input parameter, connectionDescriptor completely
   * describes user requirements on the connection to be establish. It is a
   * JSON-encoded JavaScript object composed of following attributes:
   *
   * - url (string)
   *   URL of streamer to connect to. In form:
   *       IP_OR_DOMAIN_NAME:PORT/SCOPE_ID
   *   SCOPE_ID, defines a scope within streamer. All users connected to
   *   particular scope exchange streams. If given user publishes particular
   *   stream (audio or video or both) all users connected to this scope will
   *   be receiving this stream.
   *   Additionally, the SCOPE_ID param is used in connection management
   *   API - to specify the connection on which given action should be performed
   *   (see, '@see' section below)
   *
   * - token (string)
   *   Current user's authorization token. By design, this property is used by
   *   the streamer side to verify whether user with given token is privileged
   *   to join scope with given SCOPE_ID and returns an user ID of the user as
   *   known by the application using Cloudeo. Later on, this ID is used to
   *   other users connected to given scope in userStatus notifications.
   *
   *   Since the current deployments of streamer doesn't have any authentication
   *   mechanisms implemented, this property must contain id of current user
   *
   *   TODO verify whether user status notifications are really called user status
   *
   * - lowVideoStream (object)
   *   Defines the low video stream to be published (see video configuration below)
   *
   * - highVideoStream (object)
   *   Defines the high video stream to be published (see video configuration below)
   *
   * - autopublishVideo (boolean)
   *   Boolean flag defining whether local user's video stream should be
   *   automatically published upon successful connection
   *
   * - autopublishAudio (boolean)
   *   Boolean flag defining whether local user's audio stream should be
   *   automatically published upon successful connection
   *
   * Video streams configuration
   * ===========================
   *
   * The Cloudeo plug-in for video streaming uses 2 quality layers, so called
   * 'low' and 'high' layer. The 'low' layer contains video stream with constant
   * bitrate, spatial resolution and temporal resolution (read: there aren't any
   * adaptation routines enabled for low layer).
   * On the other hand, the 'high' layer enables the user to publish high
   * quality video stream. It is being published only if the network conditions
   * allow and can be dropped down if network condition changes. The high
   * quality stream dynamically configure to provide best UX user can have in
   * given configuration. To achieve this, network and CPU use is being
   * constantly monitored and depending on the current state, the service is
   * adjusting quality, spatial resolution and temporal resolution, until
   * maximal values configured during the connection setup is reached.
   *
   * When user publishes 2 streams, both of them are used by the streamer side
   * to perform the downlink adaptation - the streamer transmits the high video
   * layer only to the participants that can actually receive it.
   *
   * Additionally it is possible to define whether current client should publish
   * or receive particular layer. The main use case here is to allow sharing
   * scopes between different types of connections. E.g. some users might be
   * participants of given conversation and thus receiving and publishing every
   * stream in it and others might be just previewing (e.g. to decide whether
   * to join it or not) thus, receiving only the low layer.
   *
   * To configure each video stream, JavaScript object with following
   * attributes:
   *
   * - publish (boolean)
   *   Boolean flag defining whether this layer should be published or not
   *
   * - receive (boolean)
   *   Boolean flag defining whether this layer should be received by current
   *   client
   *
   * - maxWidth (int)
   *   Integer defining maximal width of the video stream. The low layer will
   *   publish stream with exactly this width, the high layer will stop
   *   increasing the resolution, after reaching this value
   *
   * - maxHeight (int)
   *   Integer defining maximal height of the video stream. Same rules as with
   *   width apply.
   *
   * - maxBitRate (int)
   *   Integer defining the video stream's bitrate. The low layer will publish
   *   stream with this constant bitrate; the high layer will stop increasing the
   *   quality and resolutions when reaching this cap
   *
   * - maxFps (int)
   *   Integer defining maximal amount of frames per second the video stream
   *   should use.
   *
   * Example configuration
   * =====================
   * {
   *   lowVideoStream:
   *   {
   *     publish:true,
   *     receive:true,
   *     maxWidth:272,
   *     maxHeight:208,
   *     maxBitRate:64,
   *     maxFps:15
   *   },
   *   highVideoStream:
   *   {
   *     publish:true,
   *     receive:true,
   *     maxWidth:560,
   *     maxHeight:424,
   *     maxBitRate:400,
   *     maxFps:30
   *   },
   *   autopublishVideo:true,
   *   autopublishAudio:true,
   *   url:"dev01.saymama.com:7008/zprBEQtkp0",
   *   publishAudio:true,
   *   publishVideo:true,
   *   "token":"1"
   * }
   *
   * The actual content passed to the plug-in service, after JSON.stringify:
   * "{"label":"Roomify","lowVideoStream":{"publish":true,"receive":true,"maxWidth":272,"maxHeight":208,"maxBitRate":64,"maxFps":15},"highVideoStream":{"publish":true,"receive":true,"maxWidth":560,"maxHeight":424,"maxBitRate":400,"maxFps":30},"autopublishVideo":true,"autopublishAudio":true,"url":"dev01.saymama.com:7008/zprBEQtkp0","publishAudio":true,"publishVideo":true,"connectionType":"CONFERENCE","token":"1"}"
   *
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param  connectionDescription connection details.
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_MEDIA_INVALID_VIDEO_DEV (4001)
   *   In case there was an error using currently selected video capture device
   *   (e.g. device in use by different application or just stopped working)
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   * - SMERR_COMM_INVALID_HOST (2001)
   *   Indicates failure in DNS lookup of host specified in the url or streamer
   *   box being off-line
   *
   * - SMERR_COMM_INVALID_PORT (2002)
   *   Indicates that service failed to connect to the streaming server. Either
   *   the traffic gets blocked by the firewall or streaming server is down
   *
   * - SMERR_COMM_BAD_AUTH (2003)
   *   Indicates authentication error. Most likely due to invalid token.
   *
   * - SMERR_COMM_MEDIA_LINK_FAILURE (2005)
   *   Indicates failure in establishing media connection. It means that the
   *   media streams are blocked somewhere on the path between the user and
   *   the streaming server. Most likely, it's due to a firewall blocking media
   *   traffic.
   *
   * - SMERR_SEND_INVALID_ARGUMENT (2008)
   *   Invalid connection descriptor given.
   *
   * - SMERR_COMM_ALREADY_JOINED (2009)
   *   User with given id already joined given scope. User id must be unique
   *   in scope boundaries.
   *
   */
  function connect(responder, connectionDescription) {
    service.connect(responder, connectionDescription);
    return true;
  }

  /**
   * Disconnects previously established connection to the streaming server.
   * @see connect()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to disconnect
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_ROOM (1001)
   *   With instance of plugin service is not connected to media scope with
   *   given id.
   *
   **/
  function disconnect(responder, scopeId) {
    service.disconnect(responder, scopeId);
    return true;
  }

  /**
   * Publishes local user's video stream to already established media
   * connection. Depending on the configuration given to the connect() method
   * call to publishVideo will publish only low or both layers.
   *
   * @see connect()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to disconnect
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_ROOM (1001)
   *   With instance of plugin service is not connected to media scope with
   *   given id.
   *
   * - SMERR_MEDIA_INVALID_VIDEO_DEV (4001)
   *   In case there was an error using currently selected video capture device
   *   (e.g. device in use by different application or just stopped working)
   **/
  function publishVideo(responder, scopeId) {


    service.publishVideo(responder, scopeId);
    return true;
  }

  /**
   * Publishes local user's audio stream to already established media
   * connection.
   *
   * @see connect()
   *      unpublishAudio()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to disconnect
   * @return undefined
   *
   * Possible errors:
   * - SMERR_MEDIA_INVALID_AUDIO_DEV (4005)
   *   In case of error with initializing microphone.
   *
   * - SMERR_LOGIC_INVALID_ROOM (1001)
   *   With instance of plugin service is not connected to media scope with
   *   given id.
   *
   **/
  function publishAudio(responder, scopeId) {



    service.publishAudio(responder, scopeId);
    return true;
  }

  /**
   * Stops publishing local user's video stream to already established media
   * connection.
   *
   * @see connect(),
   *      publishVideo()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to disconnect
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_ROOM (1001)
   *   With instance of plugin service is not connected to media scope with
   *   given id.
   *
   **/
  function unpublishVideo(responder, scopeId) {



    service.unpublishVideo(responder, scopeId);
    return true;
  }

  /**
   * Stops publishing local user's audio stream to already established media
   * connection.
   *
   * @see connect(),
   *      publishVideo()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to disconnect
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_ROOM (1001)
   *   With instance of plugin service is not connected to media scope with
   *   given id.
   *
   **/
  function unpublishAudio(responder, scopeId) {



    service.unpublishAudio(responder, scopeId);
    return true;
  }

  /**
   * Gets current volume level of the audio output device;
   *
   * @see setSpeakersVolume()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return int containing volume level (unsigned int in range 0-255)
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function getSpeakersVolume(responder) {



    service.getSpeakersVolume(responder);
    return true;
  }

  /**
   * Sets current volume level of the audio output device;
   * @see getSpeakersVolume()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param volume integer containing new volume level (unsigned int in range
   *               0-255)
   * @returns undefined
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function setSpeakersVolume(responder, volume) {



    service.setSpeakersVolume(responder, volume);
    return true;
  }

  /**
   * Gets current gain level of the audio input device. Note that this method
   * should be used only if the Automatic Gain Control is disabled. Using it
   * with AGC enabled doesn't cause ane bugs, but is pointless as the AGC
   * sub-module of audio engine will change the gain almost instantly. It may
   * only cause negative experience for the user (e.g. echo or noise).
   *
   * @see setMicrophoneVolume()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return int containing gain level (unsigned int in range 0-255)
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function getMicrophoneVolume(responder) {



    service.getMicrophoneVolume(responder);
    return true;
  }

  /**
   * Sets gain level of the audio input device;
   *
   * @see setMicrophoneVolume()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return int containing gain level (unsigned int in range 0-255)
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   **/
  function setMicrophoneVolume(responder, volume) {



    service.setMicrophoneVolume(responder, volume);
    return true;
  }

  /**
   * Activates or deactivates monitoring of the audio input device activity -
   * speech level. The level will be reported using callback API micActivity()
   * method each 300ms. Monitoring mic activity is resource intensive process,
   * it is highly recommended to use it only when needed (e.g. when rendering
   * audio capture device selection form).
   *
   * @see CallbackAPI.micActivity()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param enabled boolean flag defining whether monitoring of audio capture
   *                device activity should be enabled or not
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   */
  function monitorMicActivity(responder, enabled) {



    service.monitorMicActivity(responder, enabled);
    return true;
  }


  /**
   * Starts measuring media statistics for media connection to given scope.
   *
   * @see stopMeasuringStats()
   *      CallbackAPI.newVideoStats()
   *      CallbackAPI.newAudioStats()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to measure media stats of
   * @param interval stats refresh interval
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_ARGUMENT (1002)
   *   Invalid interval given - negative value
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   */
  function startMeasuringStatistics(responder, scopeId, interval) {
    service.startMeasuringStatistics(responder, scopeId, interval);
    return true;
  }

  /**
   * Stops measuring media statistics for media connection to given scope.
   *
   * @see startMeasuringStats()
   *      CallbackAPI.newVideoStats()
   *      CallbackAPI.newAudioStats()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param scopeId  id of media scope to measure media stats of
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs
   *
   */
  function stopMeasuringStatistics(responder, scopeId) {




    service.stopMeasuringStatistics(responder, scopeId);
    return true;
  }

  /**
   * Starts playing test sound. The playing will stop automatically after
   * reaching end of the test wave file or may be stopped by calling
   * stopPlayingTestSound method. The startPlayingTestSound method is mostly
   * useful when selecting audio output device and setting volume levels - user
   * can test the device and desired levels.
   *
   * @see stopPlayingTestSound
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs. In case of this method, it may
   *   mean that the wave file used to playing the test sound is missing thus
   *   the plugin installation is somehow compromised.
   *
   */
  function startPlayingTestSound(responder) {



    service.startPlayingTestSound(responder);
    return true;
  }

  /**
   * Stops playing test sound.
   *
   * @see startPlayingTestSound
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return undefined
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs.
   */
  function stopPlayingTestSound(responder) {



    service.stopPlayingTestSound(responder);
    return true;
  }

  /**
   * Gets value of the service property. Advanced use only, check the
   * Service Properties section.
   *
   * @see setSmProperty()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param name string containing the name of the property to get value of
   *
   * Possible errors:
   *
   * - SMERR_LOGIC_INVALID_JS_PARAMETER_KEY (1003)
   *   Invalid property key was given (empty or unknown by the service)
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs.
   */
  function getSmProperty(responder, name) {
    service.getSmProperty(responder, name);
  }

  /**
   * Sets value of the service property. Advanced use only, check the
   * Service Properties section.
   *
   * @see getSmProperty()
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @param name string containing the name of the property to set value of
   * @param value value of the property to be set
   *
   * Possible errors:
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs.
   */
  function setSmProperty(responder, name, value) {
    //noinspection JSUnresolvedFunction
    service.setSmProperty(responder, name, value);
  }


  /**
   * Returns an object completely describing user's computer CPU details.
   * This method is useful when checking if user's hardware is strong enough
   * to meet criteria of the Cloudeo Plug-in.
   *
   * @param responder object that will receive asynchronous result of this call.
   *        See calling Cloudeo plug-in service methods.
   * @return host's CPU description object. Example result:
   *         {
   *           brand_string:"Intel(R) Core(TM) i5 CPU M 430 @ 2.27GHz",
   *           clock:2261,
   *           cores:4,
   *           extfamily:0,
   *           extmodel:2,
   *           family:6,
   *           model:5,
   *           stepping:2,
   *           vendor:"GenuineIntel"
   *         }
   *
   * - SMERR_DEFAULT_ERROR (-1)
   *   if an unexpected, internal error occurs.

   */
  function getHostCpuDetails(responder) {
    service.getHostCpuDetails(responder);
    return true;
  }


  function getAudioProperty(responder, name) {
    getSmProperty(responder, AUDIO_SETTINGS_PFX + name);
    return true;
  }

  function setAudioProperty(responder, name, value) {
    setSmProperty(responder, AUDIO_SETTINGS_PFX + name, value);
    return true;
  }

  //noinspection UnnecessaryLocalVariableJS
  var publicAPI = {
    setService:setService,
    getVersion:getVersion,
    addPluginListener:addPluginListener,
    getVideoCaptureDeviceNames:getVideoCaptureDeviceNames,
    setVideoCaptureDevice:setVideoCaptureDevice,
    getVideoCaptureDevice:getVideoCaptureDevice,
    getAudioCaptureDeviceNames:getAudioCaptureDeviceNames,
    setAudioCaptureDevice:setAudioCaptureDevice,
    getAudioCaptureDevice:getAudioCaptureDevice,
    getAudioOutputDeviceNames:getAudioOutputDeviceNames,
    setAudioOutputDevice:setAudioOutputDevice,
    getAudioOutputDevice:getAudioOutputDevice,
    startLocalVideo:startLocalVideo,
    stopLocalVideo:stopLocalVideo,
    connect:connect,
    disconnect:disconnect,
    publishVideo:publishVideo,
    unpublishVideo:unpublishVideo,
    publishAudio:publishAudio,
    unpublishAudio:unpublishAudio,
    getSpeakersVolume:getSpeakersVolume,
    setSpeakersVolume:setSpeakersVolume,
    getMicrophoneVolume:getMicrophoneVolume,
    setMicrophoneVolume:setMicrophoneVolume,
    monitorMicActivity:monitorMicActivity,
    startMeasuringStatistics:startMeasuringStatistics,
    stopMeasuringStatistics:stopMeasuringStatistics,
    startPlayingTestSound:startPlayingTestSound,
    stopPlayingTestSound:stopPlayingTestSound,

//    Properties management
    getSmProperty:getSmProperty,
    setSmProperty:setSmProperty,
    getAudioProperty:getAudioProperty,
    setAudioProperty:setAudioProperty,
    getHostCpuDetails:getHostCpuDetails
  };

  return publicAPI;

}());
