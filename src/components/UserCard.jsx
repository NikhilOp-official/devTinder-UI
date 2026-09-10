import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/store/slices/feedSlice";

const UserCard = ({ user, isProfile = false }) => {
  const { firstName, lastName, about, photoUrl, age, gender, _id } = user;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, _id) => {
    try {
      await axios.post(
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
    <div className="card w-full max-w-sm bg-base-100 shadow-sm">
      <figure className="aspect-[4/5] bg-base-200">
        <img
          src={
            photoUrl
              ? photoUrl
              : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt={`${firstName || "User"}'s profile`}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>
          {age ? `${age} years` : "Age not specified"} · {gender || "Gender not specified"}
        </p>
        <p>{about}</p>
        {!isProfile && (
          <div className="card-actions flex-col justify-end gap-2 sm:flex-row">
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => handleSendRequest("ignore", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;

UserCard.propTypes = {
  isProfile: PropTypes.bool,
  user: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    about: PropTypes.string,
    photoUrl: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
  }).isRequired,
};
