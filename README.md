# ✈ Flynet

> Visualize and share your flights with friends.

Flynet is a web-based flight visualization tool built on an interactive map, letting you log your flights and share them with the people you fly with.

---

## Prerequisites

Before getting started, make sure you have the following set up:

### 1. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

### 2. MapTiler API Key

Flynet uses [MapTiler](https://www.maptiler.com/) for map rendering.

1. Create an account at [maptiler.com](https://www.maptiler.com/) if you haven't already
2. In your dashboard, navigate to **API keys** in the left-hand navigation
3. Copy your API key and paste it into your `.env` file:

```env
MAPTILER_API_KEY=your_api_key_here
```

---

## Setup

```bash
# 1. Install corepack globally
npm i -g corepack

# 2. Navigate to the project directory
cd flynet

# 3. Install dependencies
yarn

# 4. Start the development server
yarn dev
```

---

## Tech Stack

- **Framework** — React
- **Bundler** — Vite
- **Mapping Library** — MapLibre
- **Data Layer** — Deck.GL
- **Map Tiles** — MapTiler
- **State Management** — Redux Toolkit with Redux API
- **Package Manager** — Yarn (via Corepack)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---