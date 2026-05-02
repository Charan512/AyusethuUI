# AyuSethu Web Portals (Frontend)

> **Enterprise Supply Chain Dashboards for the AyuSethu Ecosystem**

The AyuSethu Web UI acts as the central command hub for the entire multi-stakeholder agricultural pipeline. It provides highly secure, role-based dashboards that seamlessly adapt depending on whether the user is an Administrator, Collector, Laboratory Technician, Manufacturer, or a Public Consumer.

## 🌟 Ecosystem Portals

1. **Admin Command Center**
   - Universal monitoring across all supply chain activities.
   - Real-time weather and crop tracking analytics.
   - Overrides and analytics engine.

2. **Collector Gateway**
   - Processes crop batches sourced from rural farmers who use the AyuSethu Mobile App.
   - Triggers the automated **Machine Learning Pipeline**. Evaluates IPFS-pinned harvest photos against an EfficientNet-V2 model (hosted on Hugging Face Spaces) to autonomously verify the exact plant species (`/api/v1/ml/identify`).

3. **Laboratory Analysis Portal (Pharmacognostic API)**
   - Allows certifiers to validate medicinal/chemical thresholds of the crops.
   - Automatically generates a dynamic, tamper-proof PDF certification of the chemical composition.
   - Saves the final PDF straight to the **Filecoin IPFS Network** (via Pinata) for absolute transparency.

4. **Manufacturer Bidding & Supply Engine**
   - Live WebSocket-driven auction system (`Socket.io`) allowing enterprise drug manufacturers to bid on newly verified raw materials.
   - Completes the supply loop and generates consumer-facing QR tracking codes.

5. **Public Transparency Engine**
   - Enables consumers to scan a QR code and trace the entire historical lineage of the plant, from the farmer's geolocation data to the IPFS lab certificate.

## 🛠 Tech Stack
- **Framework:** Vite + React (JavaScript)
- **Styling:** Tailwind CSS, Framer Motion
- **State & Routing:** Context API, React Router DOM v6
- **Real-time Engine:** Socket.io-client
- **PDF Generation:** jsPDF, html2canvas

## 📦 Setup & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Configuration:**
   Configure your backend API base URL in the root folder.
   ```env
   VITE_API_BASE_URL=https://ayusethuapi.onrender.com/api/v1
   ```
3. **Run Development Server:**
   ```bash
   npm run dev
   ```
4. **Compile for Production:**
   ```bash
   npm run build
   ```
