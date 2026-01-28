const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIibVSaQnLfCt4G7e4et-x67gOlT8wKFVXnSnxtsD6-SgL3ju9fwSenuBVXGQ2eGZcuA/exec"; 

export const api = {
  bookTicket: async (formData) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "create_booking", ...formData }),
    });
    return await response.json();
  },

  verifyTicket: async (ticketId, adminSecret) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "mark_attendance", ticketId, adminSecret }),
    });
    return await response.json();
  },

  getBookings: async (adminSecret) => {
    const url = `${SCRIPT_URL}?secret=${adminSecret}`;
    const response = await fetch(url);
    return await response.json();
  }
};