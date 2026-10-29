# Calm - Space for Relaxation and Focus

A peaceful web environment with automatic playback of calming sounds and beautiful images for meditation and focus.

![Calm App](assets/images/00.webp)

## 🌟 Features

- **Automatic Sound Playback**: Plays calming sounds (singing bowl, bronze chimes) at customizable intervals
- **Beautiful Background Images**: Static or rotating nature images to create a peaceful atmosphere
- **Timed Meditation Sessions**: Choose 10 / 15 / 30 minutes, 1 hour, a custom length, from a new meditation icon next to the other icons. A bell opens the session, a nature sound plays (with fade in/out), and a bell closes it. Periodic chimes are off during timed sessions unless you turn them on
- **Breathing Exercises**: A wind icon opens guided breathing with Box, 4-7-8, 3-6-9, Coherent, 4-6, Long exhale and Physiological sigh presets, plus a custom mode (inhale / hold / exhale / hold lengths and number of rounds, or unlimited). A circle grows and shrinks with your breath and a pause icon marks the holds. A bell opens and closes the exercise. Your settings and practice stats are saved in localStorage
- **Countdown Timer**: Visual countdown to the next sound playback
- **Multilingual Support**: Available in English and Persian (Farsi)
- **Customizable Settings**: 
  - Adjust sound playback intervals
  - Choose between different calming sounds
  - Select static images or enable auto-rotation
  - Customize background change intervals
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/h-agharezaei/calm.git
   cd calm
   ```

2. Open `index.html` in your web browser or serve it with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Click the "Start" button to begin your relaxation session

## 📁 Project Structure

```
calm/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css      # Styles
│   ├── js/
│   │   └── script.js      # Main application logic
│   ├── images/            # Background images
│   ├── sounds/            # Calming sound files
│   └── crypto-qr/         # Donation QR codes
└── README.md
```

## 🎵 Sound Options

- **Singing Bowl (Gong)**: Traditional meditation bell sound
- **Bronze Bowl (Chimes)**: Gentle chiming sound for mindfulness

## 🖼️ Background Images

The app includes a collection of peaceful nature images that can be:
- Displayed as a static background of your choice
- Automatically rotated at customizable intervals

## ⚙️ Settings

Access the settings panel by clicking the gear icon in the top-right corner:

- **Sound Playback Interval**: Set how often sounds play (in seconds)
- **Sound Selection**: Choose your preferred calming sound
- **Language**: Switch between English and Persian
- **Background Mode**: Select static image or rotation mode
- **Background Interval**: Customize image rotation speed (when in rotation mode)

## 🌐 Live Demo

Visit the live demo at: [https://tpis.ir/](https://tpis.ir/)

## Analytics (optional)

Calm can send anonymous usage statistics to Google Analytics 4 or Google Tag Manager. It is **off until you set
an ID**; once set, it is on for everyone (there is no consent banner), and visitors can turn it off at any time in
Settings.

To enable it, set `ANALYTICS_ID` in [assets/js/analytics.js](assets/js/analytics.js):

- `G-XXXXXXXXXX` - GA4 measurement ID. Events are sent with `gtag`.
- `GTM-XXXXXXX` - Tag Manager container ID. Events are pushed to `dataLayer`; create the GA4 tag and
  one trigger per custom event inside Tag Manager.

Tracked events (no personal data): `app_start`, `sound_play`, `sound_toggle`, `sound_selected`,
`preset_selected`, `custom_interval_set`, `language_change`, `background_mode`, `background_change`,
`bg_sound_play`, `offline_sound_saved`, `panel_open`, `tab_switch`, `donation_click`, `donation_copy`,
`install_available`, `install_prompt_result`, `pwa_installed`. Page views and engagement time are
collected by GA4 itself. Cloudflare Web Analytics (cookieless) is separate and always on.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💝 Support

If you find this project helpful, consider supporting the developer:
- Bitcoin
- Ethereum
- Tron

QR codes are available in the donation tab within the app.

## 📜 License

This project is licensed under the GNU General Public License v3.0 - see below for details.

### GNU GPL v3.0

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

## 👤 Author

Created by [h-agharezaei](https://github.com/h-agharezaei)

## 🙏 Acknowledgments

- Nature images used for backgrounds
- Sound samples for meditation and relaxation
- Font families: Inter and [Estedad](https://github.com/aminabedi68/Estedad) (SIL OFL 1.1)

---

**Note**: This application requires user interaction to start audio playback due to browser autoplay policies.

## Blog

The blog is plain static HTML generated from Markdown, with no dependencies, in Persian (`/blog/`) and English (`/en/blog/`):

1. Add `_blog/posts/fa/<slug>.md` and/or `_blog/posts/en/<slug>.md` (lowercase latin slug; it becomes `/blog/<slug>/` or `/en/blog/<slug>/`). Use the **same file name** in both languages for a translation: the pages then link to each other with `hreflang` and the language switch. Copy the front matter of an existing post; the fields are documented at the top of `_blog/build.mjs`.
2. Add a 1200×630 cover at `assets/images/blog/<slug>.jpg` (it is also the share image).
3. Run `node _blog/build.mjs` and commit the generated `blog/`, `en/blog/`, `sitemap.xml` and `robots.txt`.

A `session` field (e.g. `min=10&sound=Sea&img=ocean` or `breath=box&rounds=8`) adds a "start" box that opens the app with that session (`lang=en` is added on English pages); put `[[session]]` on its own line to repeat it inside the text. A `## سؤال‌های متداول` / `## Frequently asked questions` section with `### question` entries is also emitted as FAQ structured data.
