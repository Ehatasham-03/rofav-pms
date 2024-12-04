import React, { createContext, useEffect, useState } from 'react'
import { api } from '../../api/ApiCall';


export const InventoryContext = createContext();
const InventoryContextProvider = (props) => {

    const groupUniqueId = JSON.parse(
        localStorage.getItem("_session")
      );
    const user = JSON.parse(localStorage.getItem("_session"));
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("selectedProperty") ? localStorage.getItem("selectedProperty") : localStorage.setItem("selectedProperty" , 'Select Property'));
    const [stateProperties, setStateProperties] = useState(selectedProperty ? localStorage.getItem("stateProperties") : localStorage.setItem("stateProperties" , 'Select Property'));
    const [bookingCID, setBookbookingCID] = useState(localStorage.getItem("cid") ? localStorage.getItem("cid") : localStorage.setItem("cid" , ''));
      
 
       const fetchProperties = async () => {
        setLoading(true);
            (async function () {
            try {
                const response = await api(
                `/property/${user?.groupUniqueId}`,
                {},
                "get"
                );
                
                setProperties(response.data || []);
                
                
            } catch (err) {
                toast.error(err.error);
            } finally {
                setLoading(false);
            }
            })();
       }





    const value = {
        fetchProperties,
        setProperties , properties,
        selectedProperty, setSelectedProperty,
        stateProperties, setStateProperties ,
        bookingCID, setBookbookingCID
    }

    
  return (
    <InventoryContext.Provider value={value}>
      {props.children}
    </InventoryContext.Provider>
  )
}

export default InventoryContextProvider