import { Toaster } from "./components/ui/sonner"
import { Routes } from "react-router"
import router from "./router"

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {router}
      </Routes>
    </>
  )
}

export default App
