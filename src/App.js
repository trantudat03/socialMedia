import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  Home,
  Login,
  Profile,
  Register,
  ResetPassword,
  Chat,
  Search,
  Layout,
} from "./pages";
import { useSelector } from "react-redux";
import Shop from "./pages/Shop";
import axios from "axios";
import { TopBar } from "./components";
import Tournament from "./components/Tournament";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

// function Layout() {
//   const { user } = useSelector((state) => state.user);
//   const location = useLocation();
//   return user?.token ? (
//     <div>
//       <TopBar text={""} />
//       <Outlet />
//     </div>
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// }

function App() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search/:text?" element={<Search />} />
          <Route path="/Chat/:id?" element={<Chat />} />
        </Route>
        <Route path="/giai" element={<Tournament />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
