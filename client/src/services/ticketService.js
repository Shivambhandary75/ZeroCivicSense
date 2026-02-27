import api from "./axios";

// Citizen: Create a new ticket (multipart for image upload)
export const createTicket = (formData) =>
  api
    .post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

// Citizen: Get my own tickets
export const getMyTickets = () => api.get("/tickets/my").then((r) => r.data);

// Admin: Get all tickets
export const getAllTickets = (params) =>
  api.get("/tickets", { params }).then((r) => r.data);

// Contractor: Get assigned tickets
export const getAssignedTickets = () =>
  api.get("/tickets/assigned").then((r) => r.data);

// Contractor: Get open (unassigned) tickets available to pick up
export const getOpenTickets = (params) =>
  api.get("/tickets/open", { params }).then((r) => r.data);

// Contractor: Self-assign to a ticket
export const selfPickTicket = (id) =>
  api.patch(`/tickets/${id}/self-pick`).then((r) => r.data);

// Official: Get tickets endorsed by the current official
export const getOfficialTickets = () =>
  api.get("/tickets/official").then((r) => r.data);

// Official: Endorse/pick a ticket
export const pickTicket = (id) =>
  api.patch(`/tickets/${id}/pick`).then((r) => r.data);

// Official: Assign a contractor to a ticket
export const assignContractor = (id, contractorId) =>
  api
    .patch(`/tickets/${id}/assign-contractor`, { contractorId })
    .then((r) => r.data);

// All roles: Public ticket feed (with vote counts)
export const getPublicTickets = (params) =>
  api.get("/tickets/public", { params }).then((r) => r.data);

// Any: Get a single ticket by ID
export const getTicketById = (id) =>
  api.get(`/tickets/${id}`).then((r) => r.data);

// Admin: Update ticket status (pass rejectionReason when rejecting)
export const updateTicketStatus = (id, status, rejectionReason) =>
  api
    .patch(`/tickets/${id}/status`, { status, rejectionReason })
    .then((r) => r.data);

// Admin: Assign ticket to contractor
export const assignTicket = (id, contractorId) =>
  api.patch(`/tickets/${id}/assign`, { contractorId }).then((r) => r.data);

// Citizen: Upvote / unvote a ticket (interest signal)
export const voteTicket = (id) =>
  api.patch(`/tickets/${id}/vote`).then((r) => r.data);

// Citizen: Validate official's work proof — direction: "up" or "down"
export const proofVoteTicket = (id, direction) =>
  api.patch(`/tickets/${id}/proof-vote`, { direction }).then((r) => r.data);

// Contractor: Upload work proof (multipart)
export const uploadWorkProof = (id, formData) =>
  api
    .post(`/tickets/${id}/proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

// Any: Delete a ticket
export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`).then((r) => r.data);

// Admin: Get contractor list (optionally filter by department)
export const getContractors = (department) =>
  api
    .get("/users/contractors", department ? { params: { department } } : {})
    .then((r) => r.data);
