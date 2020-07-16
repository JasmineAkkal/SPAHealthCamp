var webcamStream;
// Grab elements, create settings, etc.
        var video = document.getElementById('video');

// Get access to the camera!
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
                video.src = window.URL.createObjectURL(stream);
				webcamStream = stream;
                video.play();
            });
        }



        // Elements for taking the snapshot
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
		
        var video = document.getElementById('video');

// Trigger photo take
        document.getElementById("snap").addEventListener("click", function () {
            context.drawImage(video, 0, 0, 320, 200);
			video.pause();
			//video.src ="";
        });
    