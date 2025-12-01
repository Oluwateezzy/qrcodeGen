const fs = require("fs");
const csv = require("csv-parser");
const QRCode = require("qrcode");
const { randomUUID } = require("crypto");

const names = [];
const output = [];

fs.createReadStream("names.csv")
  .pipe(csv())
  .on("data", (row) => names.push(row.name))
  .on("end", async () => {
    console.log("Generating QR codes...");

    if (!fs.existsSync("qrcodes")) fs.mkdirSync("qrcodes");

    for (const name of names) {
      const id = randomUUID();

      const url = `https://qrcodegen-production-d9d5.up.railway.app/invite/${id}`;

      await QRCode.toFile(`qrcodes/${name}.png`, url);

      output.push({ id, name });
      console.log(`Generated QR for ${name}`);
    }

    fs.writeFileSync("data.json", JSON.stringify(output, null, 2));

    console.log("Done! QR codes saved in qrcodes/");
  });
