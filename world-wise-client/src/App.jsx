import { lazy, Suspense } from "react";

const Homepage = lazy(() => import("./pages/Homepage"));


function App() {

  return (
    <>
        <Homepage />
    </>
  )
}

export default App
