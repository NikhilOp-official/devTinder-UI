import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/store/slices/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store?.connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) return;
  if (connections?.length === 0) {
    return <h1 className="text-2xl font-bold">No Connections found</h1>;
  }
  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="text-2xl font-bold">Connections</h1>

      <div className="w-full max-w-2xl">
        {connections?.map((c) => {
          return (
            <div className="flex m-4 p-4 rounded-lg bg-base-300" key={c.id}>
              <div>
                <img
                  src={c.photoUrl}
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                />
              </div>

              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {c.firstName + " " + c.lastName}
                </h2>

                {c.age && c.gender && (
                  <p>
                    {c.age}, {c.gender}
                  </p>
                )}

                <p>{c.about}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
