import { Routes, Route, Router } from 'react-router-dom'

//AUTH
import Login from './components/auth/login'
import Register from './components/auth/register'
import VerifyKYC from './components/auth/VerifyKYC'
import Wallet from './components/wallet/index.tsx'

function App() {

  return (
    <div>
      <Routes>

      {/*AUTH*/}
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Register" element={<Register />} />
      <Route path="/VerifyKYC" element={<VerifyKYC />} />
      
      {/*WALLET*/}
      <Route path="/Wallet" element={<Wallet />} />


      </Routes>
    </div>
  )
}

export default App
