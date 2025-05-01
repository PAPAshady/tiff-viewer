# 🖼️ TIFF Viewer

A modern web application for viewing and editing TIFF files. This application allows users to upload TIFF files, view their contents, and make various modifications including reordering, rotating, and removing pages. After making changes, users can save their modifications and download the updated TIFF file.

## ✨ Features

- **File Upload**:
  - Upload TIFF files up to 100MB
  - Drag and drop support

- **Image Viewing**:
  - Full-screen image viewer
  - Zoom in/out functionality

- **Image Manipulation**:
  - Drag and drop reordering with smooth animations
  - Touch-friendly controls for mobile devices

- **Save & Download**:
  - Real-time change tracking
  - Download box with direct download link

- **Responsive Design**:
  - Mobile-first approach
  - Touch-optimized controls

- **Modern UI**:
  - Smooth animations and transitions
  - Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **Core**:
  - React 18
  - Vite 6
  - Tailwind CSS 3
  - Framer Motion (animations)

### Backend
- Django
- Django REST Framework
- Pillow (Python Imaging Library)

## 🚀 Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.11.5 (for backend)
- Modern web browser

### Frontend Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/PAPAshady/tiff-viewer.git
   ```
2. CD to the directory:
   ```bash
    cd tiff-viewer
   ``` 

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 💻 Usage

1. **Upload a TIFF File**:
   - Click the upload area or drag and drop a TIFF file
   - Maximum file size: 100MB
   - Supported formats: .tif, .tiff

2. **View and Edit**:
   - View all pages in a responsive grid layout
   - Click any image to open full-screen viewer
   - Use zoom controls or pinch gestures to zoom
   - Drag and drop to reorder pages
   - Click rotate button to rotate pages
   - Click delete button to remove pages
   - Hover over images to see action buttons

3. **Save Changes**:
   - Click the "Save Changes" button to apply modifications
   - Wait for the processing to complete
   - A download box will appear when the file is ready
   - Click the download button to save the modified TIFF file

## 👥 Contributors

- Frontend: [PAPAshady](https://github.com/PAPAshady)
- Backend: [Majholl](https://github.com/Majholl)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Known Limitations

- Maximum file size: 100MB
- Only supports TIFF file format
- Touch devices require modern browser for full functionality 
