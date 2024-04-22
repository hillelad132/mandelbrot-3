const canvas = document.getElementById('mandelbrotCanvas');
        const ctx = canvas.getContext('2d');

        let x1 = -2.5, x2 = 1.5, y1 = -2, y2 = 2;
        let maxIter = 100;
        let hueOffset = 100;
        let zoomFactor = 0.25;

        function mandelbrot(c, maxIter, functionType) {
            let z = { real: 0, imag: 0 };
            let n = 0;

            switch (functionType) {
                case 'zSquaredPlusC':
                    while (Math.abs(z.real + z.imag) <= 2 && n < maxIter) {
                        const tempReal = z.real * z.real - z.imag * z.imag + c.real;
                        const tempImag = 2 * z.real * z.imag + c.imag;
                        z.real = tempReal;
                        z.imag = tempImag;
                        n++;
                    }
                    break;
                case 'zCubedPlusC':
                    while (Math.abs(z.real + z.imag) <= 2 && n < maxIter) {
                        const zRealTemp = z.real;
                        z.real = z.real * z.real * z.real - 3 * z.real * z.imag * z.imag + c.real;
                        z.imag = 3 * zRealTemp * zRealTemp * z.imag - z.imag * z.imag * z.imag + c.imag;
                        n++;
                    }
                    break;
                case 'zToTheFourthPlusC':
                    while (Math.abs(z.real + z.imag) <= 2 && n < maxIter) {
                        const zRealTemp = z.real;
                        z.real = zRealTemp * zRealTemp * zRealTemp * zRealTemp - 6 * zRealTemp * zRealTemp * z.imag * z.imag + z.imag * z.imag * z.imag * z.imag + c.real;
                        z.imag = 4 * zRealTemp * zRealTemp * zRealTemp * z.imag - 4 * zRealTemp * z.imag * z.imag * z.imag + c.imag;
                        n++;
                    }
                    break;
            }

            return n;
        }

        function mapColor(value) {
            const hue = ((240 + hueOffset) * value) / maxIter;
            const sat = 1;
            const val = 1;
            return hsvToRgb(hue / 360, sat, val);
        }

        function hsvToRgb(h, s, v) {
            let r, g, b;
            let i = Math.floor(h * 6);
            let f = h * 6 - i;
            let p = v * (1 - s);
            let q = v * (1 - f * s);
            let t = v * (1 - (1 - f) * s);
            
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            
            return { r: Math.floor(r * 255), g: Math.floor(g * 255), b: Math.floor(b * 255) };
        }

        function drawMandelbrot() {
            const width = canvas.width;
            const height = canvas.height;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const zx = x1 + (x2 - x1) * x / width;
                    const zy = y1 + (y2 - y1) * y / height;
                    const c = { real: zx, imag: zy };

                    const n = mandelbrot(c, maxIter, document.getElementById('functionSelect').value);
                    const color = mapColor(n);
                    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        function updateViewport(x, y, zoom) {
            const width = x2 - x1;
            const height = y2 - y1;

            x1 = x - width * zoom / 2;
            x2 = x + width * zoom / 2;
            y1 = y - height * zoom / 2;
            y2 = y + height * zoom / 2;
        }

        canvas.addEventListener('mousedown', function(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (event.button === 0) { // Left mouse button
                updateViewport(x1 + (x2 - x1) * mouseX / canvas.width, y1 + (y2 - y1) * mouseY / canvas.height, zoomFactor);
                drawMandelbrot();
            } else if (event.button === 2) { // Right mouse button
                updateViewport(x1 + (x2 - x1) * mouseX / canvas.width, y1 + (y2 - y1) * mouseY / canvas.height, 1 / zoomFactor);
                drawMandelbrot();
            }
        });

        // Update canvas when the function type changes
        document.getElementById('functionSelect').addEventListener('change', () => {
            drawMandelbrot();
        });

        // Update canvas when max iterations or hue offset change
        document.getElementById('maxIterInput').addEventListener('input', () => {
            maxIter = parseInt(document.getElementById('maxIterInput').value);
            drawMandelbrot();
        });

        document.getElementById('hueOffsetInput').addEventListener('input', () => {
            hueOffset = parseInt(document.getElementById('hueOffsetInput').value);
            drawMandelbrot();
        });

        // Initial draw
        drawMandelbrot();