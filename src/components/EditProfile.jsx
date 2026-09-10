import { useState } from "react";
import PropTypes from "prop-types";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/store/slices/userSlice";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [showToast, setShowToast] = useState(false);

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to save profile",
      );
      console.error(error);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-8 sm:py-10 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex w-full justify-center lg:w-auto">
          <div className="card w-full max-w-md bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center text-2xl font-bold">
                Edit Profile
              </h2>
              <div className=" flex  flex-col gap-3">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    value={lastName}
                    type="text"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Photo Url</span>
                  </div>
                  <input
                    value={photoUrl}
                    type="text"
                    onChange={(e) => {
                      setPhotoUrl(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    value={age}
                    type="text"
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">gender</span>
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  >
                    {/* <option value="">Prefer not to say</option> */}
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Other</option>
                  </select>
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <input
                    value={about}
                    type="text"
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                    className="input input-bordered w-full"
                  />
                </label>
                <span className="font-bold text-red-500">{error}</span>
                <div className="card-actions justify-center my-2">
                  <button
                    onClick={() => {
                      saveProfile();
                    }}
                    className="btn btn-primary"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <UserCard
            user={{ firstName, lastName, age, gender, about, photoUrl }}
            isProfile={true}
          />
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile Saved Successfully</span>
          </div>
          {/* <div className="alert alert-success">
          <span></span>
        </div> */}
        </div>
      )}
    </>
  );
};

export default EditProfile;

EditProfile.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photoUrl: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    about: PropTypes.string,
  }).isRequired,
};
