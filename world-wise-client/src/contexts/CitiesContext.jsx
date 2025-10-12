import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city._id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await api.get("/cities");
        dispatch({ type: "cities/loaded", payload: res.data.data.cities });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload:
            err.response?.data?.message ||
            err.message ||
            "There was an error loading cities...",
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (id === currentCity._id) return;

      dispatch({ type: "loading" });
      try {
        const res = await api.get(`/cities/${id}`);
        dispatch({ type: "city/loaded", payload: res.data.data.city });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload:
            err.response?.data?.message ||
            err.message ||
            "There was an error loading the city...",
        });
      }
    },
    [currentCity._id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await api.post("/cities", newCity);
      dispatch({ type: "city/created", payload: res.data.data.city });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload:
          err.response?.data?.message ||
          err.message ||
          "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    if (!id) return;
    dispatch({ type: "loading" });
    try {
      await api.delete(`/cities/${id}`);
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload:
          err.response?.data?.message ||
          err.message ||
          "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
