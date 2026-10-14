import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not connect to backend.");
      });
  }, []);

  return (
    <div>
      <h1>AI-Powered IT Helpdesk</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;