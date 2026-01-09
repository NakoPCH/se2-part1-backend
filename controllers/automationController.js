import fs from "fs";
import path from "path";

// Define the file path
const DATA_FILE = path.join(process.cwd(), "automations.json");

// Helper: Read from file
const getAutomationsFromFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
};

// Helper: Write to file
const saveAutomationsToFile = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

// GET /automations
// ΔΙΟΡΘΩΣΗ: Αλλάξαμε το (req, res) σε (_, res)
export const getAutomations = (_, res) => {
  const automations = getAutomationsFromFile();
  res.json(automations);
};

// POST /automations
export const createAutomation = (req, res) => {
  const { name, time, selectedDevices, action } = req.body;

  if (!name || !time || !selectedDevices || selectedDevices.length === 0) {
    return res.status(400).json({ error: "Please fill all fields and select at least one device." });
  }

  const automations = getAutomationsFromFile();
  
  const newAutomation = {
    id: Date.now().toString(),
    name,
    time, 
    selectedDevices, 
    action, 
    isActive: true
  };

  automations.push(newAutomation);
  saveAutomationsToFile(automations);

  res.status(201).json(newAutomation);
};

// DELETE /automations/:id
export const deleteAutomation = (req, res) => {
  const { id } = req.params;
  let automations = getAutomationsFromFile();
  
  // Filter out the rule with the matching ID
  automations = automations.filter(a => a.id !== id);
  
  saveAutomationsToFile(automations);
  res.json({ message: "Deleted" });
};

// PUT /automations/:id 
// (Renamed from toggleAutomation to updateAutomation because it handles everything)
export const updateAutomation = (req, res) => {
  const { id } = req.params;
  const updates = req.body; 

  console.log(`[UPDATE] Request received for ID: ${id}`);
  console.log(`[UPDATE] Data received:`, updates);

  // Safety Check: If body is empty, stop here.
  if (!updates || Object.keys(updates).length === 0) {
    console.log("[UPDATE] Error: No data received in body");
    return res.status(400).json({ error: "No update data provided" });
  }
  
  const automations = getAutomationsFromFile();
  const index = automations.findIndex(a => a.id === id);
  
  if (index !== -1) {
    // Merge existing data with new updates
    // We strictly preserve the original ID to prevent it from being overwritten
    const updatedRule = { 
        ...automations[index], 
        ...updates,
        id: automations[index].id 
    };

    automations[index] = updatedRule;
    
    saveAutomationsToFile(automations);
    console.log("[UPDATE] Success. Updated Rule saved.");
    
    res.json(updatedRule);
  } else {
    console.log(`[UPDATE] Error: Rule with ID ${id} not found.`);
    res.status(404).json({ error: "Not found" });
  }
};