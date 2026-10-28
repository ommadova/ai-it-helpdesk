import { useEffect, useState } from "react";
import axios from "axios";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadTicketDetails = async () => {
      try {
        const ticketResponse = await axios.get(
          `http://127.0.0.1:8000/tickets/${ticketId}`
        );

        setTicket(ticketResponse.data);

        const activityResponse = await axios.get(
          `http://127.0.0.1:8000/tickets/${ticketId}/activities`
        );

        setActivities(activityResponse.data);
      } catch (error) {
        console.error("Error loading ticket details:", error);
      }
    };

    loadTicketDetails();
  }, [ticketId]);

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div>
      <button onClick={onBack}>
        Back to Tickets
      </button>

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

      <hr />

      <h3>Activity History</h3>

      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id}>
            <p>
              <strong>{activity.action}</strong>
              {" - "}
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketDetails;