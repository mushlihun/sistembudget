import Routing from "util/Routing/Routing";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from "react";
import { createTheme } from "@mui/material/styles";

const DarkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const LightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
export const Themes = createContext();
function App() {
  const [myTheme, setMyTheme] = useState(true);
  const toggleTheme = () => {
    setMyTheme(!myTheme);
  };
  return (
    <Themes.Provider value={{ myTheme, toggleTheme }}>
      <ThemeProvider theme={!myTheme ? LightTheme : DarkTheme}>
        <Routing />
        <ToastContainer id="toast-container" limit={1} />
      </ThemeProvider>
    </Themes.Provider>
  );
}

export default App;
