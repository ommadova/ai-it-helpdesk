import { useEffect, useState } from "react";
import axios from "axios";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);

  const [recommendation, setRecommendation] = useState("");
  const [sources, setSources] = useState([]);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

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

  const generateRecommendation = async () => {
    try {
      setLoadingRecommendation(true);

      const response = await fetch(
        `http://127.0.0.1:8000/tickets/${ticketId}/suggest`
      );

      if (!response.ok) {
        throw new Error("Failed to generate recommendation");
      }

      const data = await response.json();

      setRecommendation(data.recommendation);
      setSources(data.sources || []);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      alert("Could not generate AI recommendation.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div className="ticket-details">
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

      <h3>AI Recommendation</h3>

      <button
        onClick={generateRecommendation}
        disabled={loadingRecommendation}
      >
        {loadingRecommendation
          ? "Generating..."
          : "Generate AI Recommendation"}
      </button>

      {recommendation && (
        <div className="ai-recommendation">
          <h3>AI Suggested Solution</h3>

          <p style={{ whiteSpace: "pre-line" }}>
            {recommendation}
          </p>

          {sources.length > 0 && (
            <div>
              <h4>Sources</h4>

              <ul>
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <hr />

      <h3>Activity History</h3>

      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        activities.map((activity) => (
          <div
            className="activity-item"
            key={activity.id}
          >
            <p>
              <strong>{activity.action}</strong>
              {" - "}
              {new Date(
                activity.created_at
              ).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketDetails;