
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PIPED = "https://pipedapi.kavin.rocks";

app.get("/embed/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const infoRes = await fetch(`${PIPED}/streams/${id}`);
    const info = await infoRes.json();

    if (!info || !info.videoStreams || !info.videoStreams.length) {
      return res.status(500).send("No video streams available.");
    }

    const best = info.videoStreams.sort((a, b) => b.quality - a.quality)[0];

    res.send(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0;background:black;overflow:hidden">
        <video 
          src="${best.url}"
          controls
          autoplay
          playsinline
          style="width:100vw;height:100vh;object-fit:cover;">
        </video>
      </body>
      </html>
    `);

  } catch (e) {
    res.status(500).send("Error loading video.");
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
