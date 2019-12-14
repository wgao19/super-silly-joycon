// https://dev.to/devdevcharlie/playing-beat-saber-in-the-browser-with-body-movements-using-posenet-tensorflow-js-36km

export let videoHeight = (window.innerHeight / 3) * 2;
export let videoWidth = (window.innerWidth / 3) * 2;
export let currentPositions = {};

let video;

export function getCurrentPositions() {
  if (video === undefined) {
    lskdj();
  }
  return currentPositions;
}

async function lskdj() {
  let colorLeft = "red";
  let colorRight = "green";
  // We create an object with the parameters that we want for the model.
  const poseNetState = {
    algorithm: "single-pose",
    input: {
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: 513,
      multiplier: 0.75,
      quantBytes: 2
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5
    },
    output: {
      showVideo: true,
      showPoints: true
    }
  };

  // We load the model.
  let poseNetModel = await window.posenet.load({
    architecture: poseNetState.input.architecture,
    outputStride: poseNetState.input.outputStride,
    inputResolution: poseNetState.input.inputResolution,
    multiplier: poseNetState.input.multiplier,
    quantBytes: poseNetState.input.quantBytes
  });

  try {
    video = await setupCamera();
    video.play();
    detectPoseInRealTime(video);
  } catch (e) {
    throw e;
  }

  async function setupCamera() {
    const video = document.getElementById("video");
    video.width = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: videoWidth,
        height: videoHeight
      }
    });
    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => resolve(video);
    });
  }

  function detectPoseInRealTime(video) {
    const canvas = document.getElementById("output");
    const ctx = canvas.getContext("2d");
    const flipPoseHorizontal = true;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    async function poseDetectionFrame() {
      let poses = [];
      let minPoseConfidence;
      let minPartConfidence;

      switch (poseNetState.algorithm) {
        case "single-pose":
          const pose = await poseNetModel.estimatePoses(video, {
            flipHorizontal: flipPoseHorizontal,
            decodingMethod: "single-person"
          });
          poses = poses.concat(pose);
          minPoseConfidence = +poseNetState.singlePoseDetection
            .minPoseConfidence;
          minPartConfidence = +poseNetState.singlePoseDetection
            .minPartConfidence;
          break;
      }

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (poseNetState.output.showVideo) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.restore();
      }

      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          if (poseNetState.output.showPoints) {
            drawKeypoints(keypoints, minPartConfidence, ctx);
          }
        }
      });
      requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
  }
  function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    currentPositions = {};
    keypoints.forEach(kp => (currentPositions[kp.part] = kp));
    let leftWrist = currentPositions.leftWrist;
    let rightWrist = currentPositions.rightWrist;

    if (leftWrist.score > minConfidence) {
      const { y, x } = leftWrist.position;
      drawPoint(ctx, y * scale, x * scale, 20, colorLeft);
    }

    if (rightWrist.score > minConfidence) {
      const { y, x } = rightWrist.position;
      drawPoint(ctx, y * scale, x * scale, 20, colorRight);
    }
  }

  function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
