import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/store/slices/feedSlice";

const UserCard = ({ user }) => {
  const { firstName, lastName, about, photoUrl, age, gender, _id } = user;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={
            photoUrl
              ? photoUrl
              : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{age && gender && age + ", " + gender}</p>
        <p>{about}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignore", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
