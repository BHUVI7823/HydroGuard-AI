document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Particle Bubbles Generator
    // ==========================================
    const bubbleContainer = document.getElementById('bubble-container');
    if (bubbleContainer) {
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Random size between 15px and 80px
            const size = Math.random() * 65 + 15;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Random horizontal start position
            bubble.style.left = `${Math.random() * 100}%`;
            
            // Random speed/duration between 8s and 20s
            const duration = Math.random() * 12 + 8;
            bubble.style.animationDuration = `${duration}s`;
            
            // Random delay
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            
            bubbleContainer.appendChild(bubble);
            
            // Remove bubble after its animation completes to save resources
            setTimeout(() => {
                bubble.remove();
            }, (duration + 5) * 1000);
        };

        // Create initial batch of bubbles
        for (let i = 0; i < 15; i++) {
            createBubble();
        }

        // Periodically spawn new bubbles
        setInterval(createBubble, 900);
    }

    // ==========================================
    // 2. Mobile Drawer Navigation Toggle
    // ==========================================
    const mobMenuBtn = document.getElementById('mobile-menu-btn');
    const mobDrawer = document.getElementById('mobile-drawer');
    if (mobMenuBtn && mobDrawer) {
        mobMenuBtn.addEventListener('click', () => {
            mobDrawer.classList.toggle('open');
            const icon = mobMenuBtn.querySelector('i');
            if (mobDrawer.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
                gsap.fromTo('.drawer-link', 
                    { opacity: 0, x: -30 }, 
                    { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
                );
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobMenuBtn.contains(e.target) && !mobDrawer.contains(e.target) && mobDrawer.classList.contains('open')) {
                mobDrawer.classList.remove('open');
                mobMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    }

    // ==========================================
    // 3. Form Validation and Loading Animation
    // ==========================================
    const predictForm = document.getElementById('prediction-form');
    const valAlert = document.getElementById('validation-alert');
    const valTxt = document.getElementById('validation-txt');
    const loaderOverlay = document.getElementById('loader-overlay');
    const loaderStatus = document.getElementById('loader-status');
    const loaderFill = document.querySelector('.loader-bar-fill');

    if (predictForm) {
        predictForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            valAlert.classList.add('hidden');

            // Extract values for validation bounds check
            const ph = parseFloat(document.getElementById('ph').value);
            const tds = parseFloat(document.getElementById('tds').value);
            const turbidity = parseFloat(document.getElementById('turbidity').value);
            const doVal = parseFloat(document.getElementById('do').value);
            const bod = parseFloat(document.getElementById('bod').value);
            const cod = parseFloat(document.getElementById('cod').value);
            const nitrate = parseFloat(document.getElementById('nitrate').value);
            const fluoride = parseFloat(document.getElementById('fluoride').value);
            const hardness = parseFloat(document.getElementById('hardness').value);
            const ec = parseFloat(document.getElementById('ec').value);
            const temp = parseFloat(document.getElementById('temp').value);
            const rainfall = parseFloat(document.getElementById('rainfall').value);

            let error = '';
            if (ph < 0 || ph > 14) error = 'pH must be between 0.0 and 14.0';
            else if (tds < 0 || tds > 5000) error = 'TDS must be between 0.0 and 5000.0 mg/L';
            else if (turbidity < 0 || turbidity > 100) error = 'Turbidity must be between 0.0 and 100.0 NTU';
            else if (doVal < 0 || doVal > 15) error = 'Dissolved Oxygen must be between 0.0 and 15.0 mg/L';
            else if (bod < 0 || bod > 40) error = 'BOD must be between 0.0 and 40.0 mg/L';
            else if (cod < 0 || cod > 300) error = 'COD must be between 0.0 and 300.0 mg/L';
            else if (nitrate < 0 || nitrate > 200) error = 'Nitrate must be between 0.0 and 200.0 mg/L';
            else if (fluoride < 0 || fluoride > 5) error = 'Fluoride must be between 0.0 and 5.0 mg/L';
            else if (hardness < 0 || hardness > 1200) error = 'Hardness must be between 0.0 and 1200.0 mg/L';
            else if (ec < 0 || ec > 8000) error = 'EC must be between 0.0 and 8000.0 µS/cm';
            else if (temp < 0 || temp > 50) error = 'Temperature must be between 0.0 and 50.0 °C';
            else if (rainfall < 0 || rainfall > 500) error = 'Rainfall must be between 0.0 and 500.0 mm';

            if (error) {
                valTxt.textContent = error;
                valAlert.classList.remove('hidden');
                valAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // If valid, display loading overlay with step descriptions
            loaderOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Stop background scrolling

            // Simulate progress phases mapping with loaderStatus texting
            const phases = [
                { time: 0, text: '💧 Extracting water chemistry balance...', progress: '25%' },
                { time: 1300, text: '🧬 Encoding seasonal factors and climate data...', progress: '55%' },
                { time: 2600, text: '🌲 Evaluating Random Forest decision indices...', progress: '85%' },
                { time: 3800, text: '📊 Simulating Water Quality Index matrices...', progress: '100%' }
            ];

            phases.forEach(phase => {
                setTimeout(() => {
                    loaderStatus.textContent = phase.text;
                    loaderFill.style.width = phase.progress;
                }, phase.time);
            });

            // Submit form to backend after artificial loader delay finishes
            setTimeout(() => {
                predictForm.submit();
            }, 4500);
        });
    }

    // ==========================================
    // 4. Results Page Gauge & ChartJS Rendering
    // ==========================================
    const dataBridge = document.getElementById('raw-data-bridge');
    if (dataBridge) {
        
        // ------------------------------------------
        // A. WQI Gauge Meter Animation
        // ------------------------------------------
        const gaugeFill = document.getElementById('wqi-gauge-fill');
        const scoreValText = document.getElementById('gauge-score-val');
        if (gaugeFill && scoreValText) {
            const score = parseFloat(gaugeFill.getAttribute('data-score'));
            
            // Total circumference of circle at r=75 inside 270 degree setup is 353.4
            const maxOffset = 353.4;
            const targetOffset = maxOffset - (score / 100) * maxOffset;
            
            // Trigger transition
            setTimeout(() => {
                gaugeFill.style.strokeDashoffset = targetOffset;
            }, 300);

            // Animate score text counter
            let currentScore = 0;
            const stepTime = Math.max(Math.floor(1800 / (score * 10)), 15);
            const interval = setInterval(() => {
                if (currentScore >= score) {
                    scoreValText.textContent = score.toFixed(1);
                    clearInterval(interval);
                } else {
                    currentScore += 0.3;
                    if (currentScore > score) {
                        currentScore = score;
                    }
                    scoreValText.textContent = currentScore.toFixed(1);
                }
            }, stepTime);
        }

        // ------------------------------------------
        // B. Chart.js Config and Data Normalization
        // ------------------------------------------
        const ctxProb = document.getElementById('probabilityChart');
        const ctxRadar = document.getElementById('radarChart');
        const ctxImp = document.getElementById('importanceChart');

        // Extract raw inputs using dataset bridge attrs
        const ph = parseFloat(dataBridge.getAttribute('data-ph'));
        const tds = parseFloat(dataBridge.getAttribute('data-tds'));
        const turbidity = parseFloat(dataBridge.getAttribute('data-turbidity'));
        const doVal = parseFloat(dataBridge.getAttribute('data-do'));
        const bod = parseFloat(dataBridge.getAttribute('data-bod'));
        const cod = parseFloat(dataBridge.getAttribute('data-cod'));
        const ec = parseFloat(dataBridge.getAttribute('data-ec'));

        // Extract ML prediction details
        // Avoid errors evaluating JSON inside HTML attrs using simple eval or cleaning
        const rawClasses = dataBridge.getAttribute('data-pred-classes');
        const rawProbs = dataBridge.getAttribute('data-pred-probs');
        
        // Clean lists parses standard representations safely
        const predClasses = eval(rawClasses);
        const predProbs = eval(rawProbs).map(p => p * 100); // convert decimal rates to percentage

        // Chart.js Theme configurations
        const chartGridColor = 'rgba(255, 255, 255, 0.06)';
        const chartLabelColor = '#94a3b8';
        const chartFontFamily = 'Inter, sans-serif';

        Chart.defaults.font.family = chartFontFamily;
        Chart.defaults.color = chartLabelColor;

        // B1. Chart 1 - Prediction Probabilities Horizontal Bar
        if (ctxProb) {
            new Chart(ctxProb, {
                type: 'bar',
                data: {
                    labels: predClasses,
                    datasets: [{
                        label: 'Confidence (%)',
                        data: predProbs,
                        backgroundColor: predClasses.map((label, i) => {
                            if (i === 0) return 'rgba(0, 180, 216, 0.8)'; // Highlight top prediction
                            return 'rgba(255, 255, 255, 0.15)';
                        }),
                        borderColor: predClasses.map((label, i) => {
                            if (i === 0) return '#00B4D8';
                            return 'rgba(255, 255, 255, 0.25)';
                        }),
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 24,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(2, 6, 23, 0.95)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => `Confidence: ${context.parsed.x.toFixed(1)}%`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: chartGridColor },
                            ticks: { color: chartLabelColor },
                            max: 100,
                            title: { display: true, text: 'Confidence Percentage (%)', color: '#64748b' }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#ffffff', font: { weight: 600 } }
                        }
                    }
                }
            });
        }

        // B2. Chart 3 - Parameter Distribution Radar Chart (Normalized values for visuals, raw levels in tooltip)
        // Normalization ranges:
        // pH: 0-14, TDS: 0-1500, Turbidity: 0-15, DO: 0-10, BOD: 0-8, COD: 0-50, EC: 0-1500
        const rawNormalizers = {
            ph: { label: 'pH', raw: ph, norm: (ph / 14) * 100 },
            tds: { label: 'TDS (mg/L)', raw: tds, norm: Math.min((tds / 1500) * 100, 100) },
            turbidity: { label: 'Turbidity (NTU)', raw: turbidity, norm: Math.min((turbidity / 15) * 100, 100) },
            do: { label: 'DO (mg/L)', raw: doVal, norm: Math.min((doVal / 10) * 100, 100) },
            bod: { label: 'BOD (mg/L)', raw: bod, norm: Math.min((bod / 8) * 100, 100) },
            cod: { label: 'COD (mg/L)', raw: cod, norm: Math.min((cod / 50) * 100, 100) },
            ec: { label: 'EC (µS/cm)', raw: ec, norm: Math.min((ec / 1500) * 100, 100) }
        };

        const radarLabels = Object.values(rawNormalizers).map(item => item.label);
        const radarRawValues = Object.values(rawNormalizers).map(item => item.raw);
        const radarNormalizedValues = Object.values(rawNormalizers).map(item => item.norm);

        if (ctxRadar) {
            new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['pH', 'TDS', 'Turbidity', 'DO', 'BOD', 'COD', 'EC'],
                    datasets: [{
                        label: 'Relative Content % (Normalized)',
                        data: radarNormalizedValues,
                        backgroundColor: 'rgba(0, 180, 216, 0.15)',
                        borderColor: '#00B4D8',
                        borderWidth: 2,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#0077B6',
                        pointHoverBackgroundColor: '#00B4D8',
                        pointHoverBorderColor: '#fff',
                        pointRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(2, 6, 23, 0.95)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => {
                                    const index = context.dataIndex;
                                    const rawVal = radarRawValues[index];
                                    return `Actual Level: ${rawVal}`;
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            grid: { color: 'rgba(255, 255, 255, 0.08)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                            pointLabels: { color: '#cbd5e1', font: { size: 10, weight: 500 } },
                            ticks: { display: false },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }

        // B3. Chart 2 - ML Feature Importance Gini values mapped from user requirements
        const importanceData = [
            { feat: 'TDS', val: 19.42 },
            { feat: 'EC', val: 15.14 },
            { feat: 'BOD', val: 13.53 },
            { feat: 'Turbidity', val: 11.33 },
            { feat: 'Hardness', val: 7.13 },
            { feat: 'pH', val: 5.45 },
            { feat: 'Nitrate', val: 5.06 },
            { feat: 'Fluoride', val: 4.81 },
            { feat: 'COD', val: 4.39 },
            { feat: 'DO', val: 4.10 },
            { feat: 'Temperature', val: 3.73 },
            { feat: 'Rainfall', val: 3.56 },
            { feat: 'Source', val: 1.37 },
            { feat: 'Season', val: 0.93 }
        ];

        if (ctxImp) {
            new Chart(ctxImp, {
                type: 'bar',
                data: {
                    labels: importanceData.map(d => d.feat),
                    datasets: [{
                        label: 'Gini Importance %',
                        data: importanceData.map(d => d.val),
                        backgroundColor: 'rgba(0, 150, 199, 0.55)',
                        hoverBackgroundColor: 'rgba(0, 180, 216, 0.85)',
                        borderColor: 'rgba(0, 180, 216, 0.65)',
                        borderWidth: 1,
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(2, 6, 23, 0.95)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => `Gini Importance: ${context.parsed.y.toFixed(2)}%`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: chartLabelColor, font: { size: 10 } }
                        },
                        y: {
                            grid: { color: chartGridColor },
                            ticks: { color: chartLabelColor },
                            title: { display: true, text: 'Importance percentage (%)', color: '#64748b' }
                        }
                    }
                }
            });
        }
    }

});
