import api from "./axios";

// Get verification result for a ticket
export const getVerification = (ticketId) =>
  api.get(`/verification/${ticketId}`).then((r) => r.data);

// Trigger AI re-analysis for a ticket
export const triggerVerification = (ticketId) =>
  api.post(`/verification/${ticketId}/analyze`).then((r) => r.data);

// Submit a crowd vote on a ticket's progress
export const submitCrowdVote = (ticketId, vote) =>
  api.post(`/verification/${ticketId}/vote`, { vote }).then((r) => r.data);
