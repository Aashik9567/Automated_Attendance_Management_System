import React,{createContext,useState} from 'react'
const ActiveState = createContext();
const ActiveContextState=({children})=>{
    const [active,setActive]=useState('Home');
    return(
        <ActiveState.Provider value={{active,setActive}}>
            {children}
        </ActiveState.Provider>
    )
}
export { ActiveContextState, ActiveState };