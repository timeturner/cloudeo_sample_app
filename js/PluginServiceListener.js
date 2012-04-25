/**
 * Copyright (C) SayMama Ltd 2011
 *
 * All rights reserved. Any use, copying, modification, distribution and selling
 * of this software and it's documentation for any purposes without authors' written
 * permission is hereby prohibited.
 */


/**
 *
 * Module responsible for listening on plugin service events. It acts as event
 * proxy, dispatching received events to registered listeners, wrapping with
 * helpful data when needed (e.g. user events are dispatched after fetching
 * details about user-in-subject so all other handlers have full info about the
 * user, from both multimedia and logic perspective)
 *
 * @author Tadeusz Kozak
 * @date 28-09-2011 12:00
 *
 * <a href="http://www.saymama.com">www.saymama.com</a>
 */
var PluginServiceListener = (function () {

  /**
   * Creates and returns object that can be given to the service as a listener.
   * This object contains handlers for all events dispatched by service, without
   * internal stuff implemented in this module.
   *
   * @returns listener object compatible with plug-in service callback API
   */
  function createInstance() {
    return {
      connectionLost:onConnectionLost,
      onUserEvent:onUserEvent,
      onVideoEvent:onVideoEvent,
      onAudioEvent:onAudioEvent,
      videoFrameSizeChanged:videoFrameSizeChanged,
      micActivity:micActivity,
      spkActivity:spkActivity,
      micGain:micGain,
      deviceListChanged:deviceListChanged,
      newVideoStats:newVideoStats,
      newAudioStats:newAudioStats,
      serviceInvalidated:serviceInvalidated,
      serviceRevalidated:serviceRevalidated,
      newMediaConnectionType:newMediaConnectionType,
//      Deprecated API, defined here to avoid the FireBreath errors
      userStatus:$.noop
    };
  }

  /**
   * Public API definition object.
   */
  var publicAPI = {
    createInstance:createInstance
  };

  /**
   * ===================================================================
   * Private helpers, utilities
   * ===================================================================
   */

  /**
   * Called to notify about change of spatial resolution of video feed, rendered
   * on renderer with given id
   *
   * @param deviceId id of device which resolution has changed
   * @param width    new width
   * @param height   new height
   */
  function videoFrameSizeChanged(deviceId, width, height) {


  }

  /**
   * Called to notify about lost connection for scope with given id.
   *
   * @see ServiceAPI.connect()
   * @param scopeId    id of scope which lost connection
   * @param errCode    error code identifying the cause. Possible values are:
   *                   - SMERR_COMM_REMOTE_END_DIED (2006)
   *                     Indicates that the management connection failed to
   *                     communicate with the streamer. This may be due to
   *                     user's computer losing internet connection or problems
   *                     with the streaming server.
   * @param errMessage additional human readable error message describing in
   *                   a more detail cause of the problem.
   */
  function onConnectionLost(scopeId, errCode, errMessage) {


  }

  /**
   * Called to notify about status change of remote scope participants. This
   * method is used to notify about both new participant joining and participant
   * leaving the scope.
   *
   * @see ServiceAPI.connect()
   *      onVideoEvent()
   *      onAudioEvent()
   * @param scopeId     id of scope to which event is related
   * @param userDetails object describing the event. it is composed of
   *                    following fields:
   *                      - isConnected    boolean flag defining whether user
   *                                       just joined (true) or left (false)
   *                                       the scope
   *                      - userId         unique identifier of the user in
   *                                       subject.
   *                      - audioPublished boolean flag defining whether user
   *                                       publishes the audio stream. Used only
   *                                       when indicating new user
   *                      - videoPublished boolean flag defining whether user
   *                                       publishes the video stream. Used only
   *                                       when indicating new user
   *                      - vcamId         id of renderer which should be used
   *                                       when rendering remote user's video
   *                                       feed. Defined only when reporting new
   *                                       user with videoPublished = true.
   */
  function onUserEvent(scopeId, userDetails) {
    if (userDetails.isConnected) {
      userJoined(scopeId, userDetails)
    } else {
      userLeft(scopeId, userDetails);
    }
  }

  /**
   * Called to notify about video streaming status change for given user.
   * Streaming status change may mean either that user started or stopped
   * publishing the video stream.
   *
   * @see ServiceAPI.connect()
   *      ServiceAPI.publishVideo()
   *      ServiceAPI.unpublishVideo()
   *      onUserEvent()
   *      onAudioEvent()
   * @param scopeId     id of scope to which event is related
   * @param userDetails object describing the event. it is composed of
   *                    following fields:
   *                      - userId         unique identifier of the user in
   *                                       subject.
   *                      - videoPublished boolean flag defining whether user
   *                                       publishes the video stream. Used only
   *                                       when indicating new user
   *                      - vcamId         id of renderer which should be used
   *                                       when rendering remote user's video
   *                                       feed. Defined only when
   *                                       videoPublished = true.
   */
  function onVideoEvent(scopeId, userDetails) {
  }

  /**
   * Called to notify about audio streaming status change for given user.
   * Streaming status change may mean either that user started or stopped
   * publishing the audio stream.
   *
   * @see ServiceAPI.connect()
   *      ServiceAPI.publishAudio()
   *      ServiceAPI.unpublishAudio()
   *      onUserEvent()
   *      onVideoEvent()
   * @param scopeId     id of scope to which event is related
   * @param userDetails object describing the event. it is composed of
   *                    following fields:
   *                      - userId         unique identifier of the user in
   *                                       subject.
   *                      - audioPublished boolean flag defining whether user
   *                                       publishes the audio stream. Used only
   *                                       when indicating new user
   */
  function onAudioEvent(scopeId, userDetails) {


  }

  /**
   * Reports audio capture device activity (a.k.a. speech level).
   *
   * @see ServiceAPI.monitorMicActivity()
   *      spkActivity()
   * @param activity integer with value in range 0-255 indicating current speech
   *                 level (higher the value is, the louder input was received
   *                 by the microphone)
   */
  function micActivity(activity) {

  }

  /**
   * Reports speakers activity
   *
   * @see micActivity()
   * @param activity integer with value in range 0-255 indicating current remote
   *                 parties speech level (higher the value is, the louder input
   *                 was received by the service from remote users' audio feeds)
   */
  function spkActivity(activity) {

  }

  /**
   * Reports changes in audio capture device gain, done by the
   * Automatic Gain Control subsystem.
   *
   * @param gain integer defining new gain levels. It's values are in range
   *             0-255.
   */
  function micGain(gain) {

  }

  /**
   * Callback reporting that there was a change in hardware devices
   * configuration - it indicates that device was plugged or unplugged from
   * user's computer.
   *
   * @param audioIn  boolean flag defining whether there was a change in audio
   *                 capture devices list
   * @param audioOut boolean flag defining whether there was a change in audio
   *                 output devices list
   * @param videoIn boolean flag defining whether there was a change in video
   *                 capture devices list
   */
  function deviceListChanged(audioIn, audioOut, videoIn) {


  }

  /**
   * Reports availability of new video stream statistics for connection to media
   * scope with given id.
   *
   * @see ServiceAPI.startMeasuringStatistics()
   * @param scopeId id of scope in context of which stats were published
   * @param userId  unique identifier of remote user in context of which stats
   *                were published. -1 if stats describe state of sending link.
   * @param stats   object containing the detailed statistics. It is composed of
   *                following properties:
   *                TBD
   */
  function newVideoStats(scopeId, userId, stats) {

  }

  /**
   * Reports availability of new audio stream stats for connection to media
   * scope with given id.
   *
   * @see ServiceAPI.startMeasuringStatistics()
   * @param scopeId id of scope in context of which stats were published
   * @param userId  unique identifier of remote user in context of which stats
   *                were published. -1 if stats describe state of sending link.
   * @param stats   object containing the detailed statistics. It is composed of
   *                following properties:
   *                TBD
   */
  function newAudioStats(scopeId, userId, stats) {

  }

  /**
   * Indicates that there is an pending update process, which forced the service
   * invalidation. Any call to the invalidate service will return an error.
   * Service becomes available again, after receiving the serviceRevalidated()
   * notification.
   *
   * @see serviceRevalidated()
   */
  function serviceInvalidated() {
  }

  /**
   * Indicates that update process was complete and service is again
   * fully-functional. and up to date.
   *
   * @see serviceRevalidated()
   */
  function serviceRevalidated() {
  }

  /**
   * Informs about change in media connection type for given scope and media
   * stream. It's purpose is solely informational.
   *
   * @param scopeId        scope for which media connection type changed
   *                       occurred
   * @param mediaType      string indicating the media type for which connection
   *                       type changed. It can be either "AUDIO" or "VIDEO"
   * @param connectionType string describing the new connection type. It can be
   *                       one of:
   *                       - MEDIA_TRANSPORT_TYPE_NOT_CONNECTED
   *                         Media transport not connected at all
   *                       - MEDIA_TRANSPORT_TYPE_UDP_RELAY
   *                         Media stream is sent/received using RTP/UDP, with
   *                         help of relay server
   *                       - MEDIA_TRANSPORT_TYPE_UDP_P2P
   *                         Media stream is sent/received using RTP/UDP,
   *                         directly to and from remote participant
   *                       - MEDIA_TRANSPORT_TYPE_TCP_RELAY
   *                         Media stream is sent/received using RTP/TCP, with
   *                         help of relay server
   */
  function newMediaConnectionType(scopeId, mediaType, connectionType) {

  }

  /**
   * Other helpers
   * ======================================
   */

  function userJoined(roomId, userDetails) {
    newUser(userDetails);
  }

  function userLeft(roomId, userDetails) {
    userGone(userDetails);
  }

  return publicAPI;

}());

