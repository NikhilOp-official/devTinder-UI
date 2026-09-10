import axios from "axios";
import { useCallback, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/store/slices/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store?.connections);
  const fetchConnections = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (e) {
      console.error(e);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);
  if (!connections) return;
  if (connections?.length === 0) {
    return <h1 className="px-4 py-10 text-center text-2xl font-bold">No Connections found</h1>;
  }
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 sm:py-10">
      <h1 className="text-center text-2xl font-bold">Connections</h1>

      <div className="w-full">
        {connections?.map((c) => {
          return (
            <div
              className="flex flex-col gap-4 rounded-lg bg-base-300 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={c._id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div>
                  <img
                    src={c.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt="photo"
                    className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
                  />
                </div>

                <div className="min-w-0 text-left">
                  <h2 className="truncate text-xl font-bold">
                    {c.firstName + " " + c.lastName}
                  </h2>

                  <p>
                    {c.age ? `${c.age} years` : "Age not specified"} · {c.gender || "Gender not specified"}
                  </p>

                  <p className="break-words">{c.about}</p>
                </div>
              </div>
              <Link to={"/chat/" + c._id} className="w-full sm:w-auto">
                <button className="btn btn-secondary w-full sm:w-auto">Chat</button>
              </Link>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
