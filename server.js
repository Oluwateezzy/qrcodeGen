const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const data = JSON.parse(fs.readFileSync("data.json"));

app.use(express.static("public"));

app.get("/invite/:id", (req, res) => {
  const record = data.find((x) => x.id === req.params.id);

  if (!record) return res.status(404).send("Invalid invitation link");

  res.send(`
    <html>
  <head>
    <title>Invitation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
        margin: 0;
        background: #f9f9f9;
      }

      .container {
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      img {
        width: 100%;
        max-width: 350px;
        border-radius: 14px;
      }

      h1 {
        font-size: 24px;
        margin-top: 20px;
        color: #333;
        line-height: 1.3;
      }

      /* Small screens (phones) */
      @media (max-width: 480px) {
        h1 {
          font-size: 20px;
        }

        .container {
          padding: 15px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img src="/image.jpeg" />
      <h1>Dear ${record.name}, you are invited!</h1>
    </div>
  </body>
</html>

  `);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
