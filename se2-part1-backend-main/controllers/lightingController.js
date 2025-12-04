let devices = [];

export function addDevice(req, res) {
  const { name, type, location } = req.body;

  if (!name || !type || !location) {
    return res.status(400).json({ error: "Όνομα, τύπος και τοποθεσία απαιτούνται." });
  }

  const newDevice = {
    id: devices.length + 1,
    name,
    type,
    location,
  };

  devices.push(newDevice);

  res.status(201).json(newDevice);
}

export function listDevices(req, res) {
  res.json(devices);
}