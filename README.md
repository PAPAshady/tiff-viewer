# 🖼️ TIFF Viewer

A modern web application for viewing and editing TIFF files. This application allows users to upload TIFF files, view their contents, and make various modifications including reordering, rotating, and removing pages. After making changes, users can save their modifications and download the updated TIFF file.

## ✨ Features

- **File Upload**:
  - Upload TIFF files up to 100MB
  - Drag and drop support
  - File type validation
  - Upload progress indication

- **Image Viewing**:
  - Grid view of all pages
  - Full-screen image viewer
  - Zoom in/out functionality
  - Pan and pinch gestures
  - Page number and filename display

- **Image Manipulation**:
  - Drag and drop reordering with smooth animations
  - 90-degree rotation with visual feedback
  - One-click page deletion
  - Hover effects for action buttons
  - Touch-friendly controls for mobile devices

- **Save & Download**:
  - Real-time change tracking
  - Save changes with progress indication
  - Download box with direct download link
  - Success/error notifications

- **Responsive Design**:
  - Mobile-first approach
  - Adaptive grid layout
  - Touch-optimized controls
  - Responsive image viewer
  - Works on all screen sizes from 320px

- **Modern UI**:
  - Clean and intuitive interface
  - Smooth animations and transitions
  - Toast notifications for user feedback
  - Loading states and progress indicators
  - Consistent design language

## 🛠️ Tech Stack

### Frontend
- **Core**:
  - React 18
  - Vite 6
  - Tailwind CSS 3
  - Framer Motion (animations)

- **UI Components**:
  - React Icons
  - React Dropzone (file upload)
  - React Zoom Pan Pinch (image viewer)
  - DND Kit (drag and drop)

- **Development Tools**:
  - ESLint
  - Prettier
  - PostCSS
  - SWC (fast compilation)

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
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

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

## 🔧 API Endpoints

| Endpoint        | Method | Description               |
|-----------------|--------|---------------------------|
| `/api/upload`   | POST   | Upload TIFF file          |
| `/api/rotate`   | POST   | Rotate list of images     |
| `/api/delete`   | POST   | Delete list of images     |
| `/api/reorder`  | POST   | Reorder list of images    |

## 👥 Contributors

- Frontend: [PAPAshady](https://github.com/PAPAshady)
- Backend: [Majholl](https://github.com/Majholl)

## 📝 License

This project is open-source and free to use. Feel free to fork, star, or submit issues and pull requests.

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
- Requires modern web browser with JavaScript enabled
- Touch devices require modern browser for full functionality 