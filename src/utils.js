export const poseToChar = positions => {
  if (bodyPartsAreClose(positions.leftWrist, positions.rightWrist)) {
    return "🙆";
  }

  return "🙅";
};

const bodyPartsAreClose = (a, b) => {
  const diffX = Math.abs(a.position.x - b.position.x);
  const diffY = Math.abs(a.position.y - b.position.y);

  return diffX < 10 && diffY < 10;
};
