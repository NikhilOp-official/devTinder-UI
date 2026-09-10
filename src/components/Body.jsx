import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/store/slices/userSlice";
import { useEffect } from "react";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((store) => store.user);
  useEffect(() => {
    const fetchUser = async () => {
      if (userData) return;
      try {
        const response = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        dispatch(addUser(response.data));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
        console.error(error);
      }
    };
    fetchUser();
  }, [dispatch, navigate, userData]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
