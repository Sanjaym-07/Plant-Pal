import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // Virtual Arduino State
  let moisture = 650; // 0-1023 range
  let pumpActive = false;
  let systemEnabled = false;
  let loopInterval: NodeJS.Timeout | null = null;

  // WebSocket connection for Serial Monitor
  wss.on("connection", (ws) => {
    console.log("Client connected to Serial Monitor");
    
    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());
      if (data.type === "TOGGLE_SYSTEM") {
        systemEnabled = data.enabled;
        if (systemEnabled) {
          startArduinoLoop(ws);
        } else {
          stopArduinoLoop();
        }
      }
    });

    ws.on("close", () => {
      stopArduinoLoop();
    });
  });

  function startArduinoLoop(ws: WebSocket) {
    if (loopInterval) clearInterval(loopInterval);
    
    ws.send(JSON.stringify({ type: "SERIAL", text: "PlantPal Hardware System Initialized" }));
    
    loopInterval = setInterval(() => {
      // Simulate moisture change
      moisture += pumpActive ? -40 : 15;
      if (moisture < 0) moisture = 0;
      if (moisture > 1023) moisture = 1023;

      const log = `Moisture Level: ${moisture}`;
      ws.send(JSON.stringify({ type: "SERIAL", text: log }));

      if (moisture > 700) { // Threshold for "DRY" (higher value = drier for some sensors)
        if (!pumpActive) {
          pumpActive = true;
          ws.send(JSON.stringify({ type: "SERIAL", text: "Status: DRY - Activating Pump" }));
        }
      } else if (moisture < 400) { // Threshold for "WET"
        if (pumpActive) {
          pumpActive = false;
          ws.send(JSON.stringify({ type: "SERIAL", text: "Status: WET - Deactivating Pump" }));
        }
      }

      // Send telemetry state
      ws.send(JSON.stringify({ 
        type: "TELEMETRY", 
        moisture: Math.round((1 - moisture / 1023) * 100), // Convert to %
        pumpActive 
      }));

    }, 2000);
  }

  function stopArduinoLoop() {
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }
    pumpActive = false;
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
