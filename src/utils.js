export const poseToChar = positions => {
  if (
    bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
    positions.leftWrist.position.y < 250
  ) {
    return "🙆";
  }

  return "🙅";
};

const firstIsBeneathSecond = (
  { position: { y: yA } },
  { position: { y: yB } }
) => yA > yB;

const bodyPartsAreClose = (a, b, distance = 10) => {
  const diffX = Math.abs(a.position.x - b.position.x);
  const diffY = Math.abs(a.position.y - b.position.y);
  console.log({ diffX, diffY, a, b });
  return diffX < distance && diffY < distance;
};

export const matchPosition = (positions, predicate) => predicate(positions);

export const cuddling = ([positions]) =>
  bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
  bodyPartsAreClose(positions.leftKnee, positions.rightKnee) &&
  bodyPartsAreClose(positions.leftWrist, positions.leftKnee) &&
  bodyPartsAreClose(positions.rightWrist, positions.rightKnee);

export const raisedRightHand = ([positions]) =>
  positions.rightWrist.position.y < positions.rightShoulder.position.y;

export const facepalm = ([positions]) =>
  bodyPartsAreClose(positions.rightWrist, positions.rightEye, 150);

export const shrugging = ([positions]) =>
  firstIsBeneathSecond(positions.rightElbow, positions.rightShoulder) &&
  firstIsBeneathSecond(positions.rightShoulder, positions.rightWrist) &&
  firstIsBeneathSecond(positions.leftElbow, positions.leftShoulder) &&
  firstIsBeneathSecond(positions.leftShoulder, positions.leftWrist);

export const lotusPosition = ([positions]) =>
  bodyPartsAreClose(positions.leftWrist, positions.leftKnee, 100) &&
  bodyPartsAreClose(positions.rightWrist, positions.rightKnee, 100);
