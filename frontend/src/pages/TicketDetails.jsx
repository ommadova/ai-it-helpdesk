import { useEffect, useState } from "react";
import axios from "axios";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/tickets/${ticketId}`
        );

        setTicket(response.data);
      } catch (error) {
        console.error("Error loading ticket:", error);
      }
    };

    loadTicket();
  }, [ticketId]);

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div>
      <button onClick={onBack}>Back to Tickets</button>

      <h2>Ticket #{ticket.id}</h2>

      <p>
        <strong>Title:</strong> {ticket.title}
      </p>

      <p>
        <strong>Description:</strong> {ticket.description}
      </p>

      <p>
        <strong>Status:</strong> {ticket.status}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {ticket.category || "Not classified yet"}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        {ticket.priority || "Not assigned yet"}
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {ticket.created_at
          ? new Date(ticket.created_at).toLocaleString()
          : "Not available"}
      </p>
    </div>
  );
}

export default TicketDetails;