import Webroutes from "./components/homeComponent/Webroutes";
import { ThemeProvider } from "./theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Webroutes />
    </ThemeProvider>
  );
}

export default App;
