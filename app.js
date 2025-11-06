 // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                
                // Update active nav
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                });
                link.classList.add('active');
                
                // Show active page
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById(pageId).classList.add('active');
            });
        });

        // Strain selection
        document.querySelectorAll('.strain-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.strain-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
                updateSimulation();
            });
        });

        // Slider updates
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const valueDisplay = document.getElementById(slider.id.replace('-slider', '-value'));
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
                updateSimulation();
            });
        });

        // Simulation logic with real data
        function updateSimulation() {
            const temp = parseInt(document.getElementById('temp-slider').value);
            const light = parseInt(document.getElementById('light-slider').value);
            const co2 = parseInt(document.getElementById('co2-slider').value);
            const nitrogen = parseInt(document.getElementById('nitrogen-slider').value);
            
            // Realistic simulation based on research data
            let biomassBase, lipidContent;
            const selectedStrain = document.querySelector('.strain-card.selected').getAttribute('data-strain');
            
            // Strain-specific base values from research
            switch(selectedStrain) {
                case 'chlorella':
                    biomassBase = 1.5; // g/L/day
                    lipidContent = 0.18; // 18%
                    break;
                case 'nannochloropsis':
                    biomassBase = 0.6; // g/L/day
                    lipidContent = 0.35; // 35%
                    break;
                case 'spirulina':
                    biomassBase = 2.0; // g/L/day
                    lipidContent = 0.10; // 10%
                    break;
            }
            
            // Environmental factor calculations based on research
            const tempOptimal = selectedStrain === 'spirulina' ? 30 : 25;
            const tempFactor = 1 - Math.abs(tempOptimal - temp) * 0.03;
            
            const lightFactor = Math.min(1, light / 200);
            const co2Factor = Math.min(1, co2 / 1500);
            const nitrogenFactor = 0.5 + (nitrogen / 50);
            
            // Calculate results
            const biomassYield = biomassBase * tempFactor * lightFactor * co2Factor * nitrogenFactor;
            const oilYield = biomassYield * lipidContent;
            const costEstimate = 85 - (biomassYield - biomassBase) * 8; // Cost decreases with efficiency
            const co2Consumption = 1.8 + (co2 / 2000) * 0.4;
            
            // Update display
            document.getElementById('biomass-result').textContent = biomassYield.toFixed(2) + ' g/L/day';
            document.getElementById('oil-result').textContent = oilYield.toFixed(2) + ' g/L/day';
            document.getElementById('cost-result').textContent = '₹' + Math.max(65, costEstimate).toFixed(0) + '/L';
            document.getElementById('co2-result').textContent = co2Consumption.toFixed(1) + ' kg';
            
            updateSimulationChart();
        }

        // Charts initialization
        function initializeCharts() {
            // Growth Chart
            const growthCtx = document.getElementById('growthChart').getContext('2d');
            new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Oil Production (L/day)',
                        data: [110, 125, 118, 135, 142, 150],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            // Finance Chart
            const financeCtx = document.getElementById('financeChart').getContext('2d');
            new Chart(financeCtx, {
                type: 'bar',
                data: {
                    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                    datasets: [{
                        label: 'Revenue (₹ Lakhs)',
                        data: [40, 45, 52, 58, 65],
                        backgroundColor: '#4caf50'
                    }, {
                        label: 'Profit (₹ Lakhs)',
                        data: [15, 20, 28, 35, 42],
                        backgroundColor: '#8bc34a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            updateSimulationChart();
        }

        function updateSimulationChart() {
            const simulationCtx = document.getElementById('simulationChart').getContext('2d');
            
            // Clear existing chart
            if (window.simulationChart) {
                window.simulationChart.destroy();
            }
            
            window.simulationChart = new Chart(simulationCtx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 10', 'Day 14'],
                    datasets: [{
                        label: 'Biomass Growth (g/L)',
                        data: [0.5, 1.2, 2.1, 3.4, 5.2, 7.8],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeCharts();
            updateSimulation();
        });