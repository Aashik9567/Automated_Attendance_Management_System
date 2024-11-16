import './App.css'
import Webroutes from './components/homeComponent/Webroutes'
import { ActiveContextState } from './ContextState.jsx'

function App() {
  return (
    <>
    <ActiveContextState>
      <Webroutes />
    </ActiveContextState>
    </>
  )
}
export default App
