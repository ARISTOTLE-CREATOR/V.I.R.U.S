# VIRUS — Video-based Information & Real-time Update Service

> **Live News. One Platform. Real Time.**

VIRUS (**Video-based Information & Real-time Update Service**) is a frontend-focused live news aggregation platform designed to make accessing live news simple, fast, and convenient.

Instead of requiring users to visit multiple news websites or search across different platforms for live broadcasts, VIRUS brings available live news channels together through a single, clean interface organized by country.

The platform focuses on **accessibility, simplicity, and real-time viewing** rather than storing or redistributing news content.

---

## 🌍 What is VIRUS?

VIRUS provides a centralized interface where users can:

* 🌐 Explore news channels by country
* 📺 Access available live news streams
* 🔎 Find channels through a simple interface
* ▶️ Watch live broadcasts through embedded sources
* ⚡ Access news without unnecessary registration or complexity
* 🖥️ Use the platform directly from the browser

The goal is simple:

> **Find a country → Select a news channel → Watch the available live stream.**

---

## 🎯 Problem Statement

Live news is distributed across numerous websites, platforms, and broadcasting services.

A user looking for international news may need to:

1. Search for a particular country's news.
2. Find the official news provider.
3. Locate its live broadcast.
4. Navigate through advertisements or multiple pages.
5. Repeat the process for another channel.

VIRUS addresses this by providing a **single interface for discovering and accessing available live news channels**.

---

## 💡 Our Solution

VIRUS acts as a lightweight **live news aggregation interface**.

Rather than hosting news broadcasts itself, the platform connects users with live streams provided by external news platforms and broadcasters.

This allows the project to remain:

* Simple
* Lightweight
* Easy to navigate
* Fast to use
* Focused on the actual user requirement — watching live news

---

## 🗺️ How VIRUS Works

```text
                 VIRUS
                   │
                   ▼
          Select a Country
                   │
                   ▼
        Available News Channels
                   │
                   ▼
          Select a Channel
                   │
                   ▼
          Embedded Live Stream
                   │
                   ▼
              Watch News
```

The application presents available channels for supported countries and loads the corresponding live source when a channel is selected.

---

## 🖥️ User Experience

The interface is designed around a simple viewing workflow.

### 1. Select a Country

Users can browse the countries available on the platform.

### 2. Explore News Channels

After selecting a country, VIRUS displays the news channels available for that region.

### 3. Select a Live Channel

The user chooses a channel they want to watch.

### 4. Watch the Live Broadcast

The corresponding live stream is displayed through the integrated player.

This removes unnecessary steps between **discovering a channel and watching the news**.

---

## 🌎 Supported Countries

VIRUS is designed to support multiple countries and their available news channels.

The currently implemented countries and channels depend on the live sources integrated into the application.

> **Note:** Live availability can change because the streams are controlled by their respective broadcasters or hosting platforms.

Screenshots in this repository demonstrate the working country/channel selection and live-stream experience.

---

## 📸 Screenshots

### Country Selection

![VIRUS Country Selection](screenshots/countries.png)

The country interface allows users to discover available news sources by region.

### Live News Channel

![VIRUS Live News](screenshots/live-news.png)

After selecting a channel, the available live broadcast is displayed within the platform.

### Channel Selection

![VIRUS Channel Selection](screenshots/channels.png)

Users can select from the available news channels associated with the selected country.

> Replace the screenshot paths above with the actual paths of the screenshots stored in the repository.

---

## 🏗️ Architecture

VIRUS currently follows a **frontend-only architecture**.

```text
┌─────────────────────────────┐
│          User               │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       VIRUS Frontend        │
│                             │
│  • Country Selection        │
│  • Channel Selection        │
│  • Search / Navigation      │
│  • Live Player              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   External Live Sources     │
│                             │
│   News Providers / Streams  │
└─────────────────────────────┘
```

---

## 🚫 Why Doesn't VIRUS Use a Backend?

VIRUS intentionally does not use a traditional backend for its current requirements.

The primary purpose of the application is **simple access to live news**. Users do not need accounts, authentication, stored personal data, or complicated workflows just to watch a live broadcast.

The application does not need to:

* Store news videos
* Host streaming servers
* Manage user accounts
* Process user-generated content
* Maintain a news database for the current implementation

Instead, the frontend provides the interface and integrates available external live sources.

### Why this approach?

Adding a backend without a functional requirement would introduce unnecessary complexity.

By keeping the current architecture frontend-focused, VIRUS provides a:

**Simple → Fast → Lightweight → Easy-to-use**

news viewing experience.

---

## 🔮 Future Backend Possibilities

Although a backend is not required for the current version, it could be introduced as the project grows.

Potential future features include:

* 🔐 User accounts and authentication
* ⭐ Favorite channels
* 📰 Personalized news recommendations
* 🔄 Automatic live-stream updates
* 🗄️ Database-managed channel information
* 📊 Viewing analytics
* 🔔 Notifications for live broadcasts
* 🌐 Automatic discovery of new channels
* 🛠️ Admin dashboard for managing channels

This would allow VIRUS to evolve from a static aggregation interface into a more dynamic news platform.

---

## 📡 Where Do the Live Streams Come From?

VIRUS does **not host the original news broadcasts**.

The application uses available live-stream sources provided by external news providers and supported platforms.

The project integrates these sources into the frontend so users can access them through the VIRUS interface.

This means VIRUS functions as an **aggregation and discovery layer**, rather than a broadcasting service.

---

## ⚠️ Why Might Some Channels Not Work?

Live streaming is controlled by the original content provider.

As a result, a channel may occasionally become unavailable because:

* The live broadcast has ended.
* The broadcaster changed the stream.
* The stream URL/video ID changed.
* Embedding has been disabled.
* The content has regional restrictions.
* The provider temporarily stopped the broadcast.
* The external platform removed or restricted the stream.

Therefore, **live availability cannot always be guaranteed by VIRUS**.

The application depends on the availability and policies of the external streaming providers.

---

## 🛠️ Technology Stack

Depending on the current implementation, the project is built around modern frontend technologies such as:

| Technology              | Purpose                       |
| ----------------------- | ----------------------------- |
| React                   | User interface                |
| JavaScript / TypeScript | Application logic             |
| HTML5                   | Structure                     |
| CSS / Tailwind CSS      | Styling and responsive design |
| External Live Sources   | Live news content             |

---

## 📂 Project Structure

```text
VIRUS/
│
├── public/
│   ├── images/
│   └── ...
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── assets/
│   └── ...
│
├── package.json
├── README.md
└── ...
```

> The exact structure may vary depending on the current implementation.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Installation

```bash
git clone <YOUR-REPOSITORY-URL>
cd VIRUS
npm install
```

### Run the development server

```bash
npm run dev
```

Open the local development URL displayed in your terminal.

---

## 🎨 Design Philosophy

VIRUS follows a simple principle:

> **News should be easy to access.**

The interface avoids unnecessary steps and focuses on the core experience:

**Discover → Select → Watch**

The project prioritizes usability over unnecessary features.

---

## 🔐 Content & Responsibility

VIRUS does not claim ownership of the news broadcasts displayed through external sources.

The platform is designed to provide access to publicly available live-stream sources and does not intentionally host or redistribute the original broadcast content.

Availability and usage of external streams remain subject to the policies and permissions of their respective providers.

---

## 🚧 Current Limitations

The current version has some limitations:

* Live streams depend on external providers.
* Some channels may become temporarily unavailable.
* Stream availability may vary by region.
* Some providers may prevent third-party embedding.
* Channel information is not dynamically managed through a backend.

These limitations are expected for a frontend-focused aggregation platform.

---

## 🔮 Roadmap

### Current

* [x] Country-based navigation
* [x] News channel selection
* [x] Live-stream integration
* [x] Simple viewing interface
* [x] Responsive frontend

### Future

* [ ] Dynamic channel management
* [ ] Automatic stream availability checking
* [ ] User accounts
* [ ] Favorite channels
* [ ] Personalized news
* [ ] Notifications
* [ ] Backend/API integration
* [ ] Admin dashboard
* [ ] More countries and news providers

---

## 🤝 Contribution

Contributions and suggestions are welcome.

If you would like to improve VIRUS, you can:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes.
5. Open a Pull Request.

---

## 📄 License

Add the license that applies to your project.

If you have not selected one yet, choose an appropriate open-source license before publishing the project as open source.

---

## 👨‍💻 Project

**VIRUS — Video-based Information & Real-time Update Service**

> **A simple way to discover and access live news from around the world.**

**Live News. One Platform. Real Time.**
