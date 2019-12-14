export const poseToChar = positions => {
  if (
    bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
    positions.leftWrist.position.y < 250
  ) {
    return "🙆";
  }

  return "🙅";
};

const bodyPartsAreClose = (a, b, distance = 10) => {
  const diffX = Math.abs(a.position.x - b.position.x);
  const diffY = Math.abs(a.position.y - b.position.y);
  console.log({ diffX, diffY, a, b });
  return diffX < distance && diffY < distance;
};

export const matchPosition = (positions, predicate) => predicate(positions);

export const cuddling = ([positions]) =>
  bodyPartsAreClose(positions.leftWrist, positions.rightWrist) &&
  positions.leftWrist.position.y < 250;

export const raisedRightHand = ([positions]) =>
  positions.rightWrist.position.y < positions.rightShoulder.position.y;

export const lotusPosition = ([positions]) =>
  bodyPartsAreClose(positions.leftWrist, positions.leftKnee, 100) &&
  bodyPartsAreClose(positions.rightWrist, positions.rightKnee, 100);
