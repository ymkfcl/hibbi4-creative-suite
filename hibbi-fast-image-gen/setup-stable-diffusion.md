# Stable Diffusion Local Setup Guide

This guide will help you set up Stable Diffusion locally to work with the HIBBI Fast Image Generator.

## Prerequisites

- Python 3.10.6 or higher
- Git
- NVIDIA GPU with at least 4GB VRAM (recommended) or CPU (slower)
- At least 10GB free disk space

## Installation Steps

### 1. Install AUTOMATIC1111 WebUI

1. Clone the repository:
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
```

2. Download a Stable Diffusion model:
   - Go to https://huggingface.co/runwayml/stable-diffusion-v1-5
   - Download `v1-5-pruned-emaonly.safetensors`
   - Place it in the `models/Stable-diffusion/` folder

3. Run the WebUI:
   - **Windows**: Double-click `webui-user.bat`
   - **Linux/Mac**: Run `./webui.sh`

4. Wait for installation to complete (first run takes longer)

### 2. Configure API Access

1. Edit the launch script:
   - **Windows**: Edit `webui-user.bat`
   - **Linux/Mac**: Edit `webui-user.sh`

2. Add API arguments to the COMMANDLINE_ARGS:
```bash
set COMMANDLINE_ARGS=--api --cors-enable-origins=http://localhost:3000
```

3. Restart the WebUI

### 3. Verify Setup

1. Open your browser and go to `http://127.0.0.1:7860`
2. You should see the Stable Diffusion WebUI
3. Test the API by visiting `http://127.0.0.1:7860/docs`

### 4. Test with HIBBI

1. Start the Stable Diffusion WebUI (it should be running on port 7860)
2. Start the HIBBI application:
```bash
cd hibbi-fast-image-gen
npm run dev
```
3. Open `http://localhost:3000` and try generating an image

## Troubleshooting

### Common Issues

1. **Port 7860 is busy**: 
   - Kill any existing processes using port 7860
   - Or change the port in both the WebUI and the HIBBI code

2. **CORS errors**:
   - Make sure you added `--cors-enable-origins=http://localhost:3000` to the launch arguments
   - Restart the WebUI after making changes

3. **Out of memory errors**:
   - Add `--medvram` or `--lowvram` to the launch arguments
   - Reduce image dimensions in the HIBBI interface

4. **Slow generation**:
   - Reduce the number of steps (try 10-15 instead of 20)
   - Use smaller image dimensions
   - Consider using a faster sampler like "DPM++ 2M"

### Performance Tips

1. **For NVIDIA GPUs**: Install CUDA-compatible PyTorch
2. **For AMD GPUs**: Use `--use-cpu` flag or install ROCm
3. **For CPU only**: Add `--use-cpu all` (very slow)

## Alternative Models

You can download other models and place them in `models/Stable-diffusion/`:

- **Realistic**: Realistic Vision, DreamShaper
- **Anime**: Anything V3, Waifu Diffusion
- **Artistic**: Midjourney-like, Openjourney

## API Endpoints Used

The HIBBI application uses these AUTOMATIC1111 API endpoints:

- `POST /sdapi/v1/txt2img` - Text to image generation
- `GET /sdapi/v1/samplers` - Get available samplers
- `GET /sdapi/v1/sd-models` - Get available models

## Security Note

The WebUI API is exposed without authentication. Only run it locally and don't expose it to the internet without proper security measures.