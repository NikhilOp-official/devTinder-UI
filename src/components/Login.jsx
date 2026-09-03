import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("nikhil@gmail.com");
  const [password, setPassword] = useState("Nikhil@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        },
      );

      await dispatch(addUser(response?.data?.data));
      navigate("/");
    } catch (error) {
      setError(error?.response.data);
      console.error("an error occured");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        {
          withCredentials: true,
        },
      );

      await dispatch(addUser(response?.data?.data));
      navigate("/profile");
    } catch (error) {
      setError(error?.response.data);
      console.error("an error occured");
    }
  };

  return (
    <div className="flex justify-center  my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div className=" flex  flex-col gap-3">
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">First Name :</span>
                  </div>
                  <input
                    value={firstName}
                    type="text"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Last Name :</span>
                  </div>
                  <input
                    value={lastName}
                    type="text"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
              </>
            )}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email Id :</span>
              </div>
              <input
                value={emailId}
                type="text"
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password :</span>
              </div>
              <input
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <span className="font-bold text-red-500">{error}</span>

            <div className="card-actions justify-center my-2">
              <button
                onClick={isLoginForm ? handleLogin : handleSignup}
                className="btn btn-primary"
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>
            <p
              className="cursor-pointer m-auto"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {isLoginForm
                ? "New User? Signup Here"
                : "Existing User? Login Here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
