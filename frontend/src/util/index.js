export const combineMuiSx = (sx1 = {}, sx2 = {}) => [
  ...(Array.isArray(sx1) ? sx1 : [sx1]),
  ...(Array.isArray(sx2) ? sx2 : [sx2]),
];
