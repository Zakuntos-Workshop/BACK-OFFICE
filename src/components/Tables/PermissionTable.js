import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "api/API";
import Helper from "utils/Helper";
import { toast } from 'react-toastify'; 
import { useNavigate } from "react-router-dom"; 

export default function PermissionTable({ color }) {
  const api = new API();
  const navigate = useNavigate(); 

  const [role, setRole] = useState(null);
  const [features, setFeatures] = useState([]);
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [urlParams, setUrlParams] = useState(null);

  const helper = new Helper();

  useEffect(() => {
    const params = helper.getUrlParams(2);
    setUrlParams(params);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (urlParams) {
        const id = parseInt(urlParams, 10); 
        if (!isNaN(id)) {
          await getRole(id);
        } else {
          toast.error('ID de rôle invalide', { autoClose: 5000 });
        }
      }
    };
    fetchData();
  }, [urlParams]);

  useEffect(() => {
    if (role) {
      getFeatures();
    }
  }, [role]);

  const getRole = async (role_id) => {
    setIsDataLoad(true);
    try {
      const roleData = await api.getData(`roles/${role_id}`);
      setRole(roleData);
    } catch (error) {
      toast.error('Erreur de chargement des données du rôle', { autoClose: 5000 });
    } finally {
      setIsDataLoad(false);
    }
  };

  const getFeatures = async () => {
    setIsDataLoad(true);
    try {
      const featuresData = await api.getData(`features`);
      
      const updatedFeatures = featuresData.data.map((feat) => {
        const permission = role.permissions.find(permission => permission.feature_id === feat.id) || {
          hasRead: false,
          hasCreate: false,
          hasUpdate: false,
          hasDelete: false,
        };
        return { ...feat, permission };
      });

      setFeatures(updatedFeatures); 
    } catch (error) {
      toast.error('Erreur lors du chargement des fonctionnalités', { autoClose: 5000 });
    } finally {
      setIsDataLoad(false);
    }
  };

  const handleCheckboxChange = (featureId, permissionType, checked) => {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => 
        feature.id === featureId ? {
          ...feature,
          permission: { 
            ...feature.permission, 
            [permissionType]: checked // Met à jour la permission directement
          }
        } : feature
      )
    );
  };

  const register = async (event) => {
    event.preventDefault();
    const items = features.map((feature) => ({
      can_read: feature.permission.hasRead,
      can_create: feature.permission.hasCreate,
      can_update: feature.permission.hasUpdate,
      can_delete: feature.permission.hasDelete,
      feature_id: feature.id,
      role_id: role.id,
    }));

    try {
      const response = await api.send(items, 'role_permissions');

      if (response.status === 1) {
        toast.success('Enregistrement réussi', { autoClose: 10000 });
        setTimeout(() => {
          navigate('/admin/roles'); 
        }, 1500);
      } else {
        toast.warning('Problème de connexion, Réessayez', { autoClose: 10000 });
      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement', { autoClose: 10000 });
    }
  };

  return (
    <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
          Les Permissions
        </h3>
      </div>
      <div className="block w-full overflow-x-auto">
        {isDataLoad ? (
          <p>Chargement des données...</p>
        ) : (
          <form onSubmit={register}>
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between py-2 border-b">
                <span>{feature.name}</span>
                <div className="flex items-center">
                  {['hasRead', 'hasCreate', 'hasUpdate', 'hasDelete'].map((perm) => (
                    <label key={perm} className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={feature.permission[perm]}
                        onChange={(e) => handleCheckboxChange(feature.id, perm, e.target.checked)} 
                      />
                      <span className="ml-2">{perm.replace('has', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Enregistrer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

PermissionTable.propTypes = {
  color: PropTypes.string,
};
