const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/embed/:id", async (req, res) => {
  const videoId = req.params.id;

  try {
    const autoplay = req.query.autoplay === "0" ? 0 : 1;
    
    const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${autoplay}`;


    const ytResponse = await fetch(youtubeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Referer": "https://www.youtube.com/"
      }
    });

    if (!ytResponse.ok) {
      console.error("YouTube ERROR:", ytResponse.status);
      return res.send(`<h2>Error loading video (YouTube returned ${ytResponse.status}).</h2>`);
    }

    let embedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: black;
        }
        iframe {
          width: 100vw;
          height: 100vh;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${autoplay}&controls=1"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    </body>
    </html>
    `;

    res.send(embedHtml);

  } catch (error) {
    console.error("Proxy error:", error);
    res.send(`<h2>Error loading video.</h2>`);
  }
});

// Render usa port dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Spear Proxy running on port", PORT);
});
