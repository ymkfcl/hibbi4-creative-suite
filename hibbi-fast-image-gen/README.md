# HIBBI Fast Image Generator

A powerful AI image generation application built with React, Next.js, and TypeScript. Supports local Stable Diffusion integration with automatic fallback to demo mode.

## 🚀 Features

- **Real AI Image Generation**: Integrates with local Stable Diffusion (AUTOMATIC1111 WebUI)
- **Advanced Controls**: Steps, CFG scale, samplers, negative prompts, custom dimensions
- **Smart Fallback**: Automatic demo mode when Stable Diffusion is unavailable
- **User-Friendly Interface**: Intuitive controls with size presets and advanced settings
- **Download Support**: Save generated images directly to your device
- **Status Monitoring**: Real-time connection status to Stable Diffusion
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start

1. **Install dependencies:**
   ```bash
   # Run the installation script (Windows)
   install.bat
   
   # Or manually install
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎨 Usage Modes

### Demo Mode (Default)
- Works immediately without any setup
- Generates colorful placeholder images based on your prompts
- Perfect for testing the interface and functionality

### Full AI Mode (Recommended)
- Requires local Stable Diffusion installation
- Generates real AI images using advanced models
- See `setup-stable-diffusion.md` for detailed setup instructions

### Cloud API Mode (Advanced)
- Use OpenAI DALL-E or Hugging Face APIs
- Requires API keys (not included)
- Modify `fallbackImageService.ts` to enable

## 🔧 Configuration

### Stable Diffusion Setup
1. Install AUTOMATIC1111 WebUI
2. Enable API access with CORS
3. Start WebUI on default port 7860
4. See `setup-stable-diffusion.md` for complete instructions

### Advanced Parameters
- **Steps**: Number of denoising steps (1-150)
- **CFG Scale**: How closely to follow the prompt (1-30)
- **Sampler**: Algorithm for image generation
- **Negative Prompt**: What to avoid in the image
- **Dimensions**: Custom width and height (64-2048px)

## 📁 Project Structure

```
src/
├── components/
│   ├── ImageGenerator.tsx    # Main generation interface
│   └── StatusIndicator.tsx   # Connection status display
├── pages/
│   ├── api/
│   │   └── generate.ts       # API endpoint for image generation
│   └── index.tsx            # Main page
├── utils/
│   ├── imageUtils.ts        # Core image generation logic
│   └── fallbackImageService.ts # Fallback and alternative services
└── styles/
    └── globals.css          # Global styles
```

## 🐛 Bug Fixes Applied

1. **Fixed API Parameter Mismatch**: Corrected size parameter handling between frontend and backend
2. **Fixed Response Format**: Standardized API response format (`imageUrl` vs `image`)
3. **Improved Error Handling**: Added comprehensive error messages and fallback mechanisms
4. **Fixed CORS Issues**: Added proper CORS configuration for local Stable Diffusion
5. **Enhanced Type Safety**: Added TypeScript interfaces for all parameters
6. **Fixed Canvas Issues**: Resolved fallback image generation in browser environment

## 🔍 Troubleshooting

### Common Issues

**"Demo Mode" showing instead of real images:**
- Check if Stable Diffusion WebUI is running on port 7860
- Verify CORS is enabled in WebUI launch arguments
- Check the status indicator for connection details

**Generation fails with errors:**
- Reduce image dimensions if out of memory
- Lower the number of steps for faster generation
- Try different samplers if one fails

**Slow generation:**
- Reduce steps to 10-15 for faster results
- Use smaller image dimensions
- Try "DPM++ 2M" sampler for speed

### Performance Tips

- **GPU**: Ensure CUDA is properly installed for NVIDIA GPUs
- **Memory**: Use `--medvram` or `--lowvram` flags if running out of VRAM
- **CPU**: Add `--use-cpu all` for CPU-only generation (very slow)

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Samplers**: Update the samplers array in `ImageGenerator.tsx`
2. **API Integration**: Modify `fallbackImageService.ts` for new services
3. **UI Improvements**: Edit components in the `components/` directory

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- Check `setup-stable-diffusion.md` for installation help
- Review troubleshooting section above
- Open an issue for bugs or feature requests