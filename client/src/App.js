import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const url = "http://localhost:8080/node";
  const neourl = "http://localhost:8080/node/nodesOfNeo4j";

  const [postgreSQLData, setPostgreSQLData] = useState([]);
  const [neo4jData, setNeo4jData] = useState([]);
  const [createForm, setCreateForm] = useState({ name: "", properties: "" });
  const [btn, setBtn] = useState("Add");
  const [updateId, setUpdateId] = useState();

  useEffect(() => {
    fetchPostgreSQLData();
    fetchNeo4jData();
  }, []);

  const fetchPostgreSQLData = async () => {
    try {
      const response = await axios.get(url);

      setPostgreSQLData(response.data.data);
    } catch (error) {
      console.error("Error fetching data from PostgreSQL:", error);
    }
  };

  const fetchNeo4jData = async () => {
    try {
      const response = await axios.get(neourl);

      setNeo4jData(response.data.data.nodesFromNeo4j);
    } catch (error) {
      console.error("Error fetching data from Neo4j:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(url, {
        ...createForm,
        properties: JSON.parse(createForm.properties),
      });

      setPostgreSQLData((prevData) => [
        ...prevData,
        response.data.data.postgreData,
      ]);

      setNeo4jData((prevData) => [...prevData, response.data.data.neo4jData]);

      setCreateForm({ name: "", properties: "" });
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${url}/${updateId}`, {
        properties: JSON.parse(createForm.properties),
      });

      setPostgreSQLData((prevData) => {
        const updatedData = prevData.map((item) =>
          item?.id === updateId ? response.data.data.postgreData : item
        );
        return updatedData;
      });

      setNeo4jData((prevData) => {
        const updatedData = prevData.map((item) =>
          item?.properties?.syncId === updateId
            ? response.data.data.neo4jData
            : item
        );

        return updatedData;
      });

      setBtn("Add");
      setCreateForm({ name: "", properties: "" });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);

      setPostgreSQLData((prevData) =>
        prevData.filter((item) => item?.id !== id)
      );

      setNeo4jData((prevData) =>
        prevData.filter((item) => item?.properties.syncId !== id)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChangeForm = (e) => {
    setCreateForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const changeNode = (id, name, properties) => {
    setCreateForm({ name, properties: JSON.stringify(properties) });
    setBtn("Update");
    setUpdateId(id);
  };

  return (
    <div>
      <div>
        <h2>PostgreSQL Database</h2>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={createForm.name}
            onChange={handleChangeForm}
          />
          <input
            type="text"
            name="properties"
            placeholder="Properties (JSON)"
            value={createForm.properties}
            onChange={handleChangeForm}
          />
          <button
            onClick={() => (btn === "Add" ? handleCreate() : handleUpdate())}
          >
            {btn}
          </button>
        </div>
        {postgreSQLData?.map((item) => {
          return (
            <div key={item?.id}>
              <div>Name: {item?.name}</div>
              <div>
                Properties:{" "}
                {Object.entries(item?.properties).map(
                  (property) => ` ${property[0]}: ${property[1]}`
                )}
              </div>
              <button
                onClick={() =>
                  changeNode(item?.id, item?.name, item?.properties)
                }
              >
                Update
              </button>
              <button onClick={() => handleDelete(item?.id)}>Delete</button>
            </div>
          );
        })}
      </div>
      <div>
        <h2>Neo4j Database</h2>
        {neo4jData?.map((item) => {
          return (
            <div key={item?.properties?.syncId}>
              <div>Name: {item?.name}</div>
              <div>
                Properties:{" "}
                {Object.entries(item?.properties).map((property) => {
                  if (property[0] !== "syncId") {
                    return ` ${property[0]}: ${property[1]}`;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
