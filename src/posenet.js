// https://dev.to/devdevcharlie/playing-beat-saber-in-the-browser-with-body-movements-using-posenet-tensorflow-js-36km

export let videoHeight = (window.innerHeight / 3) * 2;
export let videoWidth = (window.innerWidth / 3) * 2;
export let currentPositions = [];
let nextPositions = [];
let colorLeft = "red";
let colorRight = "green";
export function getCurrentPositions() {
  return currentPositions;
}
(async function lskdj() {
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

  let video;

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

      const pose = await poseNetModel.estimatePoses(video, {
        flipHorizontal: flipPoseHorizontal,
        // decodingMethod: "single-person"
        decodingMethod: "multi-person"
        // maxDetections: guiState.multiPoseDetection.maxPoseDetections,
        // scoreThreshold: guiState.multiPoseDetection.minPartConfidence,
        // nmsRadius: guiState.multiPoseDetection.nmsRadius
      });
      poses = poses.concat(pose);
      minPoseConfidence = +poseNetState.singlePoseDetection.minPoseConfidence;
      minPartConfidence = +poseNetState.singlePoseDetection.minPartConfidence;

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
      currentPositions = nextPositions; // atomic swap
      requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
  }
})();

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  let newPosition = {};
  keypoints.forEach(kp => (newPosition[kp.part] = kp));
  nextPositions.push(newPosition); // queue it up for next round
  let leftWrist = newPosition.leftWrist;
  let rightWrist = newPosition.rightWrist;

  if (leftWrist.score > minConfidence / 2) {
    const { y, x } = leftWrist.position;
    drawPoint(ctx, y * scale, x * scale, 20, colorLeft);
  }

  if (rightWrist.score > minConfidence / 2) {
    const { y, x } = rightWrist.position;
    drawPoint(ctx, y * scale, x * scale, 20, colorRight);
  }
  drawFace("leftEye");
  drawFace("rightEye");
  drawFace("nose");
  drawFace("leftShoulder");
  drawFace("rightShoulder");
  function drawFace(str) {
    let pos = newPosition[str].position;
    drawPoint(ctx, pos.y * scale, pos.x * scale, 20, "cyan");
  }
}

function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}
