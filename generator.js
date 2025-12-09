const fs = require("fs");
const csv = require("csv-parser");
const QRCode = require("qrcode");
const { randomUUID } = require("crypto");

const names = [];
let existingData = [];

// Load existing data.json if it exists
if (fs.existsSync("data.json")) {
  try {
    const rawData = fs.readFileSync("data.json", "utf-8");
    existingData = JSON.parse(rawData);
    console.log(`Loaded ${existingData.length} existing entries from data.json`);
  } catch (error) {
    console.warn("Could not parse data.json, starting fresh:", error.message);
    existingData = [];
  }
}

fs.createReadStream("names.csv")
  .pipe(csv())
  .on("data", (row) => names.push(row.name))
  .on("end", async () => {
    console.log("Generating QR codes...");

    if (!fs.existsSync("qrcodes")) fs.mkdirSync("qrcodes");

    // Start with existing data
    const output = [...existingData];
    const existingNames = new Set(existingData.map(entry => entry.name));

    for (const name of names) {
      // Check if name already exists
      if (existingNames.has(name)) {
        console.log(`Skipping ${name} - already exists`);
        continue;
      }

      const id = randomUUID();
      const url = `https://qrcodegen-production-d9d5.up.railway.app/invite/${id}`;

      await QRCode.toFile(`qrcodes/${name}.png`, url);

      output.push({ id, name });
      existingNames.add(name);
      console.log(`Generated QR for ${name}`);
    }

    fs.writeFileSync("data.json", JSON.stringify(output, null, 2));

    console.log("Done! QR codes saved in qrcodes/");
  });
