import { useState } from "react";
import axios from "axios";

function CreateTicket({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/tickets", {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      if (onTicketCreated) {
        onTicketCreated();
      }

      alert("Ticket created successfully.");
    } catch (error) {
      console.error(error);
      alert("Error creating ticket.");
    }
  };

  return (
    <div>
      <h2>Create Support Ticket</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default CreateTicket;