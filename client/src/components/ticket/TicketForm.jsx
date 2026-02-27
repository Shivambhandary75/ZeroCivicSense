import React, { useState, useRef } from "react";
import Button from "../common/Button";
import { createTicket } from "../../services/ticketService";
import { UploadIcon } from "../common/Icons";
import LocationPicker from "../map/LocationPicker";

const LABEL_STYLE = { color: "var(--brand)" };
const INPUT_STYLE = {
  backgroundColor: "var(--cream)",
  border: "1.5px solid var(--sand-dark)",
  color: "var(--brand)",
};
const INPUT_FOCUS = (e) => { e.target.style.borderColor = "var(--brand)"; };
const INPUT_BLUR  = (e) => { e.target.style.borderColor = "var(--sand-dark)"; };

const TicketForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "road",
    location: { lat: "", lng: "", address: "" },
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLocation = (loc) =>
    setForm((prev) => ({ ...prev, location: loc }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.location.lat) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("lat", form.location.lat);
      formData.append("lng", form.location.lng);
      if (form.location.address) formData.append("address", form.location.address);
      if (image) formData.append("image", image);
      await createTicket(formData);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="text-sm px-4 py-2.5 rounded-lg border"
          style={{ backgroundColor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
        >
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={LABEL_STYLE}>Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Pothole on MG Road"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
          style={INPUT_STYLE}
          onFocus={INPUT_FOCUS}
          onBlur={INPUT_BLUR}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={LABEL_STYLE}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
          style={INPUT_STYLE}
          onFocus={INPUT_FOCUS}
          onBlur={INPUT_BLUR}
        >
          <option value="road">Road / Pothole</option>
          <option value="water">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="garbage">Garbage</option>
          <option value="drainage">Drainage</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={LABEL_STYLE}>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the issue in detail..."
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150 resize-none"
          style={INPUT_STYLE}
          onFocus={INPUT_FOCUS}
          onBlur={INPUT_BLUR}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={LABEL_STYLE}>Location *</label>
        <LocationPicker value={form.location} onChange={handleLocation} />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Upload Image</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
        <div
          onClick={() => fileRef.current.click()}
          className="rounded-xl p-5 text-center cursor-pointer transition-all duration-150 border-2 border-dashed"
          style={{ borderColor: "var(--sand-dark)", backgroundColor: "var(--cream)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sand-dark)"; }}
        >
          {preview ? (
            <img src={preview} alt="preview" className="h-32 mx-auto rounded-lg object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2" style={{ color: "var(--steel-dark)" }}>
              <UploadIcon size={22} />
              <p className="text-xs">Click to upload image evidence</p>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Submit Ticket
      </Button>
    </form>
  );
};

export default TicketForm;
