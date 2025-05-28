document.addEventListener('DOMContentLoaded', () => {
    const validateForm = (form) => {
        try {
            const fields = {
                title: form.querySelector('#title')?.value,
                amount: parseFloat(form.querySelector('#amount')?.value),
                price: parseFloat(form.querySelector('#price')?.value),
                project: form.querySelector('#project')?.value,
                location: form.querySelector('#location')?.value,
                certification: form.querySelector('#certification')?.value
            };
            if (Object.values(fields).some(field => !field)) {
                alert('All fields required.');
                return false;
            }
            if (fields.amount <= 0 || fields.price <= 0) {
                alert('Amount and price must be positive.');
                return false;
            }
            alert(`Listed!\n${fields.title}: ${fields.amount} tons at $${fields.price}/ton\n${fields.project}, ${fields.location}\n${fields.certification}`);
            form.reset();
            return true;
        } catch (error) {
            console.error('Form error:', error);
            alert('Error submitting form.');
            return false;
        }
    };

    const handleBuyClick = (button) => {
        try {
            const title = button.closest('.card-body')?.querySelector('.card-title')?.textContent || 'Credit';
            alert(`Buying ${title}!`);
        } catch (error) {
            console.error('Buy error:', error);
            alert('Purchase failed.');
        }
    };

    const handleNewsletter = (form) => {
        try {
            const email = form.querySelector('#email')?.value;
            if (email && /\w+@\w+\.\w+/.test(email)) {
                const success = document.querySelector('#newsletterSuccess');
                success.classList.remove('d-none');
                setTimeout(() => {
                    success.classList.add('d-none');
                    form.reset();
                }, 2000);
            } else {
                alert('Invalid email.');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            alert('Subscription failed.');
        }
    };

    const handleContactForm = (form) => {
        try {
            const fields = {
                name: form.querySelector('#name')?.value,
                email: form.querySelector('#email')?.value,
                message: form.querySelector('#message')?.value
            };
            if (Object.values(fields).some(field => !field)) {
                alert('All fields required.');
                return;
            }
            if (!/\w+@\w+\.\w+/.test(fields.email)) {
                alert('Invalid email.');
                return;
            }
            alert(`Sent!\n${fields.name}, ${fields.email}\n${fields.message}`);
            form.reset();
        } catch (error) {
            console.error('Contact error:', error);
            alert('Message failed.');
        }
    };

    const handleCalculator = (form) => {
        try {
            const shortFlights = parseInt(form.querySelector('#shortFlights')?.value || 0);
            const longFlights = parseInt(form.querySelector('#longFlights')?.value || 0);
            const carMiles = parseInt(form.querySelector('#carMiles')?.value || 0);
            const carType = form.querySelector('#carType')?.value || 'gasoline';
            const electricity = parseFloat(form.querySelector('#electricity')?.value || 0);
            const diet = form.querySelector('#diet')?.value || 'meat';

            if ([shortFlights, longFlights, carMiles, electricity].some(val => val < 0)) {
                alert('Inputs cannot be negative.');
                return;
            }

            const shortFlightEmissions = shortFlights * 1000 * 0.15; // kg CO2e
            const longFlightEmissions = longFlights * 3000 * 0.12;
            const carEmissions = (carType === 'gasoline' ? 
                carMiles * 1.609 * 0.180 : 
                carMiles * 1.609 * 0.120);
            const electricityEmissions = electricity * 0.4;
            const dietEmissions = {
                'meat': 4000,
                'vegetarian': 2500,
                'vegan': 1800
            }[diet];

            const totalCO2 = (shortFlightEmissions + longFlightEmissions + carEmissions + electricityEmissions + dietEmissions) / 1000;

            const resultDiv = document.querySelector('#calculatorResult');
            resultDiv.innerHTML = `${totalCO2.toFixed(1)} tons CO2e/year. <a href="buy.html" class="text-primary">Offset Now</a>`;
            resultDiv.classList.add('alert', 'alert-light', 'p-1', 'm-0');
        } catch (error) {
            console.error('Calculator error:', error);
            alert('Calculation failed.');
        }
    };

    const handleQuiz = (form) => {
        try {
            const answers = {
                q1: form.querySelector('input[name="q1"]:checked')?.value,
                q2: form.querySelector('input[name="q2"]:checked')?.value,
                q3: form.querySelector('input[name="q3"]:checked')?.value
            };
            if (Object.values(answers).some(answer => !answer)) {
                alert('Please answer all questions.');
                return;
            }

            let score = 0;
            const correct = { q1: 'b', q2: 'b', q3: 'b' };
            for (const [key, value] of Object.entries(answers)) {
                if (value === correct[key]) score++;
            }

            const explanations = {
                q1: 'A carbon credit represents a verified reduction of one metric ton of CO2e. <a href="about.html">Learn more</a>.',
                q2: 'Reforestation projects often have high CO2 sequestration potential due to tree growth. <a href="buy.html">Explore projects</a>.',
                q3: 'The average U.S. footprint is ~16 tons CO2e/year. Try our calculator! <a href="#calculatorForm">Calculate</a>.'
            };

            const resultContent = `
                <p class="fw-bold">Score: ${score}/3</p>
                <p class="small">${score === 3 ? 'Perfect! You\'re a carbon expert!' : 'Great effort! Here’s what you learned:'}</p>
                <ul class="list-group list-group-flush small">
                    <li class="list-group-item">1. ${explanations.q1} ${answers.q1] === correct.q1 ? '✓' : '✗'}</li>
                    <li class="list-group-item">2. ${explanations.q2} ${answers.q2] === correct.q2 ? '✓' : '✗'}</li>
                    <li class="list-group-item">3. ${explanations.q3} ${answers.q3] === correct.q3 ? '✓' : '✗'}</li>
                </ul>
            `;
            document.querySelector('#quizResultContent').innerHTML = resultContent;
            const modal = new bootstrap.Modal(document.querySelector('#quizResultModal'));
            modal.show();
            form.reset();
        } catch (error) {
            console.error('Quiz error:', error);
            alert('Quiz submission failed.');
        }
    };

    const initMap = () => {
        try {
            const map = L.map('map').setViewId([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
                width: 300px,
                height: 300px;
            }).addTo(map);
            const projects = [
                { lat: -3.4653, lng: -62.2159, title: 'Amazon', desc: 'Forest preservation' },
                { lat: 20.5937, lng: 78.9629, title: 'Solar', desc: 'Solar farms, India' },
                { lat: -1.2864, lng: 36.8172, title: 'Reforestation', desc: 'Kenya tree planting' },
                ];
            projects.forEach(project => {
                L.marker([project.lat, project.lng]).addTo(map)
                    .bindPopup(`<b>${project.title}</b><br>${project.desc}`);
            });
        } catch (error) {
            console.error('Map error:', error);
            document.querySelector('#map').innerHTML = '<p class="text-center text-danger small">Map failed to load.</p>';
        }
    };

    const cycleUpdates = () => {
        try {
            const updates = document.querySelectorAll('.update-item');
            let index = 0;
            setInterval(() => {
                updates.forEach(item => item.style.display = 'none';
                updates[index].style.display = 'block';
                index = (index + 1) % updates.length;
            }, 4000);
        } catch (error) {
            console.error('Updates error:', error);
        }
    });

    const animateCounters = () => {
        try {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const increment = target / 100;
                const updateCounter = () => {
                    count += document.querySelector(increment);
                    if (count < target) {
                        counter.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        observer.disconnect();
                    }
                }, { threshold: 0.5 });
                observer.observe(counter);
            });
        } catch (error) {
            console.error('Counter error:', error);
        }
    };

    const handleFilter = (select) => {
        try {
            const value = select.value;
            const cards = document.querySelectorAll('.credit-card');
            cards.forEach(card => {
                if (value === 'all' || 
                    card.dataset.type === value.split('-')[1] || 
                    card.dataset.location === value.split('-')[1]) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Filter error:', error);
        }
    };

    document.querySelectorAll('form:not(#newsletterForm):not(#contactForm):not(#calculatorForm):not(#quizForm)')).forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            validateForm(form);
        });
    });

    const newsletterForm = document.querySelector('#newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleNewsletter(newsletterForm);
        });
    }

    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactForm(contactForm);
        });
    }

    const calculatorForm = document.querySelector('#calculatorForm');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCalculator(calculatorForm);
        });
    }

    const quizForm = document.querySelector('#quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleQuiz(quizForm);
        });
    }

    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.type !== 'submit') {
            button.addEventListener('click', () => handleBuyClick(button));
        }
    });

    try {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
    } catch (error) {
        console.error('Tooltip error:', error);
    }

    const mapModal = document.querySelector('#projectMapModal');
    if (mapModal) {
        mapModal.addEventListener('shown.bs.modal', initMap, { once: true });
    }

    if (document.querySelector('#updatesFeed')) {
        cycleUpdates();
    }

    if (document.querySelector('.counter')) {
        animateCounters();
    }

    const filterSelect = document.querySelector('#creditFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => handleFilter(filterSelect));
    }
});