export const poseToChar = positions => {
  if (
    bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
    positions.leftWrist.position.y < 250
  ) {
    return "🙆";
  }

  return "🙅";
};

const bodyPartsAreClose = (a, b) => {
  const diffX = Math.abs(a.position.x - b.position.x);
  const diffY = Math.abs(a.position.y - b.position.y);

  return diffX < 10 && diffY < 10;
};

export const matchPosition = (positions, predicate) => predicate(positions);

export const cuddling = ([positions]) =>
  bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
  positions.leftWrist.position.y < 250;

export const raisedRightHand = ([positions]) =>
  positions.rightWrist.position.y < positions.rightShoulder.position.y;

export const facepalm = ([positions]) => {
  const diffX = Math.abs(
    positions.rightWrist.position.x - positions.rightEye.position.x
  );
  const diffY = Math.abs(
    positions.rightWrist.position.y - positions.rightEye.position.y
  );

  return diffX < 150 && diffY < 150;
};
