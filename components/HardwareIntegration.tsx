import React, { useState, useEffect } from 'react';
import { Cpu, Droplets, Power, Code, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const ARDUINO_CODE = `
// PlantPal Smart Irrigation System
// Hardware: Arduino Uno, Soil Moisture Sensor, Relay Module

const int MOISTURE_PIN = A0;
const int RELAY_PIN = 8;
const int THRESHOLD = 400;

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("SYSTEM: Initialized");
}

void loop() {
  int moistureValue = analogRead(MOISTURE_PIN);
  
  // Send raw data for the Web App parser
  Serial.print("Moisture:");
  Serial.println(moistureValue);
  
  if (moistureValue < THRESHOLD) {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Pump: ON");
  } else {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Pump: OFF");
  }
  
  delay(2000);
}
`;

const HardwareIntegration: React.FC = () => {
  const [isHardwareEnabled, setIsHardwareEnabled] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [moistureLevel, setMoistureLevel] = useState(0);
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [serialPort, setSerialPort] = useState<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // WebSocket for Simulation
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (isSimulationMode) {
        if (data.type === 'SERIAL') {
          setSerialLogs(prev => [...prev.slice(-49), `[SIM] ${data.text}`]);
        } else if (data.type === 'TELEMETRY') {
          setMoistureLevel(data.moisture);
          setIsPumpActive(data.pumpActive);
        }
      }
    };
    return () => ws.close();
  }, [isSimulationMode]);

  // Web Serial API for Real Hardware
  const connectHardware = async () => {
    if (!('serial' in navigator)) {
      alert('Your browser does not support the Web Serial API. Please use Chrome or Edge.');
      return;
    }

    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      setSerialPort(port);
      setIsHardwareEnabled(true);
      setIsSimulationMode(false);
      
      const reader = port.readable.getReader();
      const decoder = new TextDecoder();
      
      setSerialLogs(prev => [...prev, `[SYSTEM] Connected to Arduino on USB Port`]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        setSerialLogs(prev => [...prev.slice(-49), text.trim()]);
        
        // Simple parser for telemetry
        if (text.includes('Moisture:')) {
          const val = parseInt(text.split(':')[1]);
          setMoistureLevel(Math.round((1 - val / 1023) * 100));
        }
        if (text.includes('Pump: ON')) setIsPumpActive(true);
        if (text.includes('Pump: OFF')) setIsPumpActive(false);
      }
    } catch (err) {
      console.error('Serial Error:', err);
      alert('Failed to connect to hardware. Make sure the board is plugged in and not in use by another app.');
    }
  };

  const toggleSimulation = () => {
    const nextState = !isSimulationMode;
    setIsSimulationMode(nextState);
    setIsHardwareEnabled(nextState);
    if (socket) {
      socket.send(JSON.stringify({ type: 'TOGGLE_SYSTEM', enabled: nextState }));
    }
    if (nextState) {
      setSerialLogs(prev => [...prev, `[SYSTEM] Starting Backend Simulation...`]);
    } else {
      setSerialLogs(prev => [...prev, `[SYSTEM] Simulation Stopped`]);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [serialLogs]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-panel-bg backdrop-blur-md border border-panel-border rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/20 rounded-xl">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-light">Hardware Integration</h1>
              <p className="text-text-dark">Connect your physical Arduino or use the Emulator</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={connectHardware}
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
                serialPort ? 'bg-secondary text-slate-900' : 'bg-primary text-white hover:scale-105'
              }`}
            >
              <Cpu className="w-4 h-4" />
              {serialPort ? 'CONNECTED VIA USB' : 'CONNECT VIA USB'}
            </button>

            <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-panel-border">
              <span className="text-xs font-semibold text-text-dark">EMULATOR</span>
              <button
                onClick={toggleSimulation}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isSimulationMode ? 'bg-secondary' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isSimulationMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-panel-bg backdrop-blur-md border border-panel-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-secondary" />
              Live Telemetry
            </h3>
            
            <div className="space-y-6">
              {!isHardwareEnabled && (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-dashed border-panel-border text-center">
                  <p className="text-xs text-text-dark italic">No hardware or simulation active. Connect a board to see data.</p>
                </div>
              )}
              
              {isHardwareEnabled && (
                <>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-text-dark">Soil Moisture</span>
                      <span className="text-sm font-bold text-text-light">{moistureLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          moistureLevel < 40 ? 'bg-red-500' : moistureLevel < 70 ? 'bg-secondary' : 'bg-blue-500'
                        }`}
                        style={{ width: `${moistureLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-panel-border">
                    <div className="flex items-center gap-3">
                      <Power className={`w-5 h-5 ${isPumpActive ? 'text-secondary animate-pulse' : 'text-text-dark'}`} />
                      <span className="text-sm font-medium text-text-light">Water Pump</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPumpActive ? 'bg-secondary/20 text-secondary' : 'bg-slate-700 text-text-dark'
                    }`}>
                      {isPumpActive ? 'RUNNING' : 'IDLE'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-panel-bg backdrop-blur-md border border-panel-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Setup Guide
            </h3>
            <ul className="space-y-3">
              {[
                'Plug Arduino into USB port',
                'Upload the code (see below)',
                'Click "CONNECT VIA USB"',
                'Select your Arduino from the list',
                'Monitor real-time data'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-dark">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Serial Monitor Section */}
        <div className="lg:col-span-2">
          <div className="bg-panel-bg backdrop-blur-md border border-panel-border rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
            <div className="p-4 bg-slate-900/50 border-b border-panel-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm text-text-light">Serial Monitor - 9600 baud</span>
              </div>
              <button 
                onClick={() => setSerialLogs([])}
                className="px-4 py-1.5 bg-slate-700 text-text-light text-xs font-bold rounded-lg hover:bg-slate-600 transition"
              >
                Clear Output
              </button>
            </div>
            <div 
              ref={scrollRef}
              className="p-6 flex-grow overflow-auto font-mono text-sm text-green-400 bg-black/90 min-h-[400px]"
            >
              {serialLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 italic gap-4">
                  <Cpu className="w-12 h-12 opacity-20" />
                  <p>Waiting for hardware connection or emulator start...</p>
                </div>
              ) : (
                serialLogs.map((log, i) => (
                  <div key={i} className="mb-1 leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-panel-border flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-xs text-text-dark italic">
                {serialPort 
                  ? 'Connected to physical hardware. Data is streaming directly from your USB port.' 
                  : 'Disconnected. Use the buttons above to connect a real board or start the emulator.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareIntegration;
