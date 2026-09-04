# 📡 V.I.R.U.S

**V.I.R.U.S** is a modern, open-source platform for watching free live TV channels from around the world.

What makes V.I.R.U.S unique is its "database" — there is no backend server. All channel lists are maintained in simple **Markdown (`.md`) files**. This makes it incredibly easy for the community to add new channels, update links, or fix broken streams via a simple Pull Request.

Built with **Vite**, **React**, and **Tailwind CSS**.

## Features

- **Global Coverage:** Watch channels from India, Argentina, Australia, and more.
- **Hybrid Player:** Supports both HLS (`.m3u8`) streams and YouTube Live streams seamlessly.
- **Markdown Powered:** Channel data is parsed directly from human-readable Markdown tables.
- **Blazing Fast:** Built on Vite for instant loading and performance.
- **Responsive:** Works on Mobile, Desktop, and TV Browsers.

## Data Source & Attribution

All channel data, playlists, and country lists are sourced directly from the amazing **[Free-TV/IPTV](https://github.com/Free-TV/IPTV)** repository.

This project acts as a modern web interface for that dataset. We strictly adhere to their philosophy:
- **Quality over Quantity:** Focus on working, high-quality streams.
- **Only Free Channels:** No paid subscriptions or pirated content.
- **Mainstream Content:** No adult, religious, or political propaganda channels.

The raw channel lists are fetched live from:
`https://github.com/Free-TV/IPTV/tree/master/lists`

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/V.I.R.U.S.git](https://github.com/yourusername/V.I.R.U.S.git)
   cd V.I.R.U.S

```

2. **Install dependencies**
```bash
npm install

```


3. **Run the development server**
```bash
npm run dev

```


4. Open your browser and navigate to `http://localhost:5173`.

> **Note for Developers:** If you are testing HLS streams (m3u8) on localhost, you may need a **CORS Extension** enabled in your browser, as many TV stations block localhost requests.

## How to Add Channels

The beauty of OpenAir is how easy it is to add channels.

### 1. The File Structure

Channel lists are located in the `public/channels/` directory (or fetched remotely).

* `india.md`
* `brazil.md`
* `argentina.md`

### 2. The Data Format

We use a standard Markdown table format. To add a channel, simply append a row to the existing table in the country's file.

**Format:**

```markdown
| # | Channel Name | Link | Logo | EPG id |
|:-:|:------------:|:----:|:----:|:------:|
| 1 | Channel Name | [>](STREAM_URL) | <img src="LOGO_URL" /> | ID |

```

**Example:**

```markdown
| 1 | DD News | [>](https://www.youtube.com/c/ddnews/live) | <img height="20" src="[https://i.imgur.com/logo.png](https://i.imgur.com/logo.png)" /> | DDNews.in |

```

### 3. Adding a New Country

1. Create a new file (e.g., `france.md`) in `public/channels/`.
2. Add your table of channels.
3. Update `public/channels/manifest.json` to register the new file:
```json
[
  ...
  { "id": "france", "name": "France", "file": "france.md" }
]

```

## Tech Stack

* **Framework:** [React](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Video Player:** [React Player](https://github.com/cookpete/react-player)
* **Icons:** [Lucide React](https://lucide.dev/)

## Contributing

Contributions are what keep this project alive!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/NewChannels`).
3. Commit your changes (`git commit -m 'Add new channels for Japan'`).
4. Push to the branch (`git push origin feature/NewChannels`).
5. Open a Pull Request.

## Disclaimer

This project is a link aggregator and a web interface. **OpenAir does not host any streams or content.** All streams are pulled from public sources available on the internet.

* If a channel is down, it is likely an issue with the source stream, not the app.
* We do not condone piracy. Only free-to-air (FTA) or publicly available streams should be added.
