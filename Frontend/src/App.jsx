import { ToastContainer } from 'react-toastify'
import './App.css'
import Webroutes from './components/homeComponent/Webroutes'
import { ActiveContextState } from './ContextState.jsx'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
    <ActiveContextState>
    <ToastContainer/>
      <Webroutes />
      
    </ActiveContextState>
    </>
  )
}
export default App
