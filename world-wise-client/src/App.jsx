import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";
import { CitiesProvider } from "./contexts/CitiesContext.jsx";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/product" element={<Product />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <CitiesProvider>
                    <AppLayout />
                  </CitiesProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
