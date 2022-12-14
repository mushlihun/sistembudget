const toolbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  px: [1],
};

const paper = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  height: "240px",
};

const containerStyle = {
  "& li a": {
    color: "white",
    textDecoration:"none",
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { toolbar, paper ,containerStyle};
