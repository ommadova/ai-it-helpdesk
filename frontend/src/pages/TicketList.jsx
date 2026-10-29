import axios from "axios";
 

function TicketList({
  tickets,
  onTicketUpdated,
  onSelectTicket, 
 }) {

  const updateStatus = async (ticketId, status) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/tickets/${ticketId}`,
        {
          status: status,
        }
      );

      if (onTicketUpdated) {
        onTicketUpdated();
      }

    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  return (
    <div>
      <h2 className="support-tickets-title"> Support Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        tickets.map((ticket) => (
          <div className="ticket-card" key={ticket.id}>
            <h3>
              #{ticket.id} - {ticket.title}
            </h3>

            <p>{ticket.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="status-badge">
                {ticket.status}
              </span>
            </p>

            <select
              value={ticket.status}
              onChange={(event) =>
                updateStatus(ticket.id, event.target.value)
              }
            >
              <option value="Open">Open</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Resolved">
                Resolved
              </option>
              <option value="Closed">
                Closed
              </option>
            </select>

            <p>
              <strong>Category:</strong>{" "}
              {ticket.category || "Not classified yet"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {ticket.priority || "Not assigned yet"}
            </p>

            <button
              onClick={() => onSelectTicket(ticket.id)}
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketList;