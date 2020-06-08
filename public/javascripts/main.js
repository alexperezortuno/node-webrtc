'use strict';

// Put variables in global scope to make them available to the browser console.
let video = document.querySelector('video');
const constraints = window.constraints = {
    audio: false,
    video: true
};
const errorElement = document.querySelector('#errorMsg');

const onSuccess = function (stream) {
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.onended = function () {
        console.log('Stream ended');
    };
    window.stream = stream; // make variable available to browser console
    video = attachMediaStream(video, stream);
};

const onFailure = function (error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);
};

AdapterJS.webRTCReady(function(isUsingPlugin) {
    if (typeof Promise === 'undefined') {
        navigator.getUserMedia(constraints, onSuccess, onFailure);
    } else {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(onSuccess).catch(onFailure);
    }
});

function errorMsg(msg, error) {
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}
