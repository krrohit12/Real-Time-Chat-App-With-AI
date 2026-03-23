import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setisOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setproject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        setproject((prev) => [...prev, res.data]);
        setProjectName("");
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
        setproject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/users/logout", { withCredentials: true });
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-code-box-line text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">DevCollab</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300">
            <i className="ri-user-line"></i>
            <span>{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition"
          >
            <i className="ri-logout-box-line"></i>
            Logout
          </button>
        </div>
      </header>

      <div className="px-8 py-8">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">My Projects</h2>
            <p className="text-gray-400 text-sm mt-1">{project.length} project{project.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setisOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-lg"
          >
            <i className="ri-add-line text-lg"></i>
            New Project
          </button>
        </div>

        {/* Project Grid */}
        {project.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
            <i className="ri-folder-open-line text-6xl mb-4"></i>
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm mt-1">Click "New Project" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {project.map((proj) => (
              <div
                key={proj._id}
                onClick={() => navigate(`/project`, { state: { project: proj } })}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/40 transition">
                    <i className="ri-folder-3-line text-blue-400 text-xl"></i>
                  </div>
                  <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-blue-400 transition"></i>
                </div>
                <h3 className="font-semibold text-white capitalize truncate mb-2">{proj.name}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <i className="ri-group-line"></i>
                  <span>{proj.users.length} collaborator{proj.users.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-96">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Create New Project</h2>
              <button onClick={() => setisOpen(false)} className="text-gray-400 hover:text-white transition">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={createProject}>
              <label className="block mb-2 text-sm text-gray-400">Project Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. my-express-app"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  onClick={() => setisOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
