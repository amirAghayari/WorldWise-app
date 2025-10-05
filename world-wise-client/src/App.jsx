import { lazy, Suspense } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));

function App() {

  return (
    <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
            <Route index element={<Homepage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/pricing" element={< Pricing/>} />
        </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App
