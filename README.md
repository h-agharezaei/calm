# Calm - Space for Relaxation and Focus

A peaceful web environment with automatic playback of calming sounds and beautiful images for meditation and focus.

![Calm App](assets/images/00.webp)

## 🌟 Features

- **Automatic Sound Playback**: Plays calming sounds (singing bowl, bronze chimes) at customizable intervals
- **Beautiful Background Images**: Static or rotating nature images to create a peaceful atmosphere
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
- Font families: Inter and Vazirmatn

---

**Note**: This application requires user interaction to start audio playback due to browser autoplay policies.
