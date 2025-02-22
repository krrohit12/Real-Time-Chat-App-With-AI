import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setisOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project, setproject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log({ projectName });

    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        console.log("Project created:", res.data);
        setisOpen(false);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
      });
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        console.log(res.data);
        setproject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/users/logout", {
        withCredentials: true, // Ensure cookies are sent
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <main className="p-4 relative h-screen">
      <div className="projects flex flex-wrap gap-3">
        <button
          className="project border border-slate-300 p-4 rounded-md"
          onClick={() => setisOpen(true)}
        >
          New Project
          <i className="ri-links-line mx-2"></i>
        </button>
        {project.map((project) => (
          <div
            key={project._id}
            onClick={() => {
              navigate(`/project`, {
                state: { project },
              });
            }}
            className="project flex flex-col gap-2 border border-slate-300 p-4 rounded-md cursor-pointer min-w-52 hover:bg-slate-300"
          >
            <h2 className="font-semibold">{project.name}</h2>
            <div className="flex gap-2">
              <p>
                <small>
                  <i className="ri-group-line"></i> Collaborators:
                </small>
              </p>
              {project.users.length}
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create a New Project</h2>
            <form onSubmit={createProject}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setisOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition duration-300 flex items-center gap-2"
      >
        <i className="ri-logout-box-line text-lg"></i> Logout
      </button>
    </main>
  );
};

export default Home;
