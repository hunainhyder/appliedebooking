import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";

const checkTicket = async (id) => {
  const SCRIPT_URL = import.meta.env.VITE_API_URL;
  const url = `${SCRIPT_URL}?action=verify_ticket&ticketId=${id}`;
  const res = await fetch(url);
  return await res.json();
};

export default function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTicket(id).then((res) => {
      if (res.status === 'success') {
        setData(res.ticket);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <h2>Verifying Ticket...</h2>;
  if (!data) return <h2 style={{color:'red'}}>❌ Invalid Ticket ID</h2>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "green" }}>✅ Verified Ticket</h2>
      <p>Status: <strong>{data.used === 'TRUE' ? 'ALREADY USED' : 'VALID FOR ENTRY'}</strong></p>
      
      {/* Re-use your beautiful component to show the details */}
      <Ticket name={data.name} ticketId={id} />
    </div>
  );
}