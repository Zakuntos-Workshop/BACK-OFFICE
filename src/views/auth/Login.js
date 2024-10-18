import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API"; // Assurez-vous que le chemin est correct
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const api = new API();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoad(true);
    setErrorMessage('');

    const credentials = {
      email,
      password,
    };

    const response = await api.send(credentials, "login");

    if (response === undefined) {
      toast.warning("Echec serveur !", { autoClose: 10000 });
      setLoad(false);
    } else {
      if (response?.access_token) {
        let user = response.user;

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("access_token", response.access_token);
 
        const features = await loadFeatures(response.access_token);
        loadPermissions(user?.role?.permissions, features);

        toast.success("Authentification réussie", { autoClose: 5000 });
        navigate('/admin/dashboard'); 

      } else {
        toast.warning("Echec d'authentification !", { autoClose: 10000 });
      }
      setLoad(false);
    }
  };

  const loadFeatures = async (access_token) => {
    const features = await api.getData(
      "features?page=1&per_page=50",
      "GET",
      access_token
    );
    return features.data;
  };

  const loadPermissions = (permissions, features) => {
    features.map((feat, i) => {
      if (permissions.length > 0) {
        permissions.map((permission) => {
          if (permission.feature_id === feat.id) {
            features[i]["permission"] = {
              hasRead: permission.can_read,
              hasCreate: permission.can_create,
              hasUpdate: permission.can_update,
              hasDelete: permission.can_delete,
            };
          }
        });
      } else {
        features[i]["permission"] = {
          hasRead: false,
          hasCreate: false,
          hasUpdate: false,
          hasDelete: false,
        };
      }
    });
    localStorage.setItem("features", JSON.stringify(features));
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    RP-BACK-OFFICE
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Veuillez vous authentifier</small>
                </div>
                <form onSubmit={handleSignIn}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Mot de Passe
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="text-red-500 text-center mb-3">
                      <small>{errorMessage}</small>
                    </div>
                  )}

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                      disabled={load}
                    >
                      {load ? "Chargement..." : "Se Connecter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>Mot de passe ?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <a href="#pablo" className="text-blueGray-200">
                  <small>Demander un compte ?</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
