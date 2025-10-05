import { lazy, Suspense } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

const Homepage = lazy(() => import("./pages/Homepage"));


function App() {

  return (
    <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
            <Route index element={<Homepage />} />
        </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App
