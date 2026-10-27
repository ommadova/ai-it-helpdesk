import { useEffect, useState } from "react";
import axios from "axios";

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
      console.error(error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

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
        <CreateTicket onTicketCreated={loadTickets} />

        <hr />

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