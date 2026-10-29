import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TicketList";
import TicketDetails from "./pages/TicketDetails";

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const loadTickets = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/tickets"
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;


  return (
    <div>
      <h1>AI-Powered IT Helpdesk</h1>

      {selectedTicketId ? (
        <TicketDetails
          ticketId={selectedTicketId}
          onBack={() => setSelectedTicketId(null)}
        />
      ) : (
        <>
          <div className="dashboard">
            <div className="dashboard-card">
              <h3>Total Tickets</h3>
              <p>{totalTickets}</p>
            </div>

            <div className="dashboard-card">
              <h3>Open</h3>
              <p>{openTickets}</p>
            </div>

            <div className="dashboard-card">
              <h3>In Progress</h3>
              <p>{inProgressTickets}</p>
            </div>

            <div className="dashboard-card">
              <h3>Resolved</h3>
              <p>{resolvedTickets}</p>
            </div>
          </div>

          <CreateTicket onTicketCreated={loadTickets} />

          <TicketList
            tickets={tickets}
            onTicketUpdated={loadTickets}
            onSelectTicket={setSelectedTicketId}
          />
        </>
      )}
    </div>
  );
}

export default App;