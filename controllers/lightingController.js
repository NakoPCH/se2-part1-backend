import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "devices.json");

// --- HARDCODED ROOMS (Source of Truth) ---
const VALID_ROOMS = ["Living Room", "Bedroom", "Kitchen"];

// Helper: Read from file
const getDevicesFromFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper: Write to file
const saveDevicesToFile = (devices) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(devices, null, 2));
};

// --- CONTROLLER FUNCTIONS ---

// GET /rooms (New!)
export function getRooms(req, res) {
  res.json(VALID_ROOMS);
}

export function listDevices(req, res) {
  const devices = getDevicesFromFile();
  res.json(devices);
}

export function addDevice(req, res) {
  const { name, category, location } = req.body;
  if (!name || !category || !location) {
    return res.status(400).json({ error: "Name, category, and location are required." });
  }

  // Define default attributes
  let specificAttributes = {};
  switch (category) {
    case "lamps": specificAttributes = { status: false, brightness: 100, color: "#ffffff" }; break;
    case "thermostats": specificAttributes = { currentTemp: 21, targetTemp: 24, mode: "heat" }; break;
    case "acs": specificAttributes = { status: false, temperature: 20, fanSpeed: "low" }; break;
    case "cameras": specificAttributes = { status: "active", isRecording: false, battery: 100 }; break;
    default: specificAttributes = { status: false };
  }

  const newDevice = {
    id: Date.now().toString(),
    name,
    category,
    location, // Now likely coming from our dropdown
    ...specificAttributes,
  };

  const devices = getDevicesFromFile();
  devices.push(newDevice);
  saveDevicesToFile(devices);
  res.status(201).json(newDevice);
}

export function updateDevice(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const devices = getDevicesFromFile();
  const deviceIndex = devices.findIndex((d) => d.id === id);

  if (deviceIndex === -1) return res.status(404).json({ error: "Device not found" });

  devices[deviceIndex] = { ...devices[deviceIndex], ...updates };
  saveDevicesToFile(devices);
  res.json(devices[deviceIndex]);
}

// DELETE /devices/:id (New!)
export function deleteDevice(req, res) {
  const { id } = req.params;
  let devices = getDevicesFromFile();
  
  const initialLength = devices.length;
  // Filter out the device with the matching ID
  devices = devices.filter(d => d.id !== id);

  if (devices.length === initialLength) {
    return res.status(404).json({ error: "Device not found" });
  }

  saveDevicesToFile(devices);
  res.status(200).json({ message: "Device deleted successfully" });
}