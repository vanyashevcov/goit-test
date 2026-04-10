document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date('2025-03-01T00:00:00').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        if (distance < 0) {
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minsEl.innerText = '00';
            secsEl.innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minsEl.innerText = String(minutes).padStart(2, '0');
        secsEl.innerText = String(seconds).padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    const openBtn = document.getElementById('openMobileModal');
    const closeBtn = document.getElementById('closeModal');
    const formContainer = document.getElementById('formContainer');
    const backdrop = document.getElementById('modalBackdrop');

    if (openBtn && closeBtn && formContainer && backdrop) {
        const openModal = () => {
            formContainer.classList.add('modal-active');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            formContainer.classList.remove('modal-active');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        };

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
    }

    const form = document.getElementById('registrationForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required]');

            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (!input.checked) {
                        isValid = false;
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                    }
                } else if (input.type === 'email') {
                    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!re.test(input.value)) {
                        isValid = false;
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                    }
                } else if (input.type === 'tel') {
                    const phoneVal = input.value.replace(/\D/g, '');
                    if (phoneVal.length < 7) {
                        isValid = false;
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                    }
                } else if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            });

            if (isValid) {
                const submitBtn = form.querySelector('.form-btn');
                submitBtn.disabled = true;
                submitBtn.innerText = 'Відправка...';

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    showSuccess();
                    form.reset();
                } catch (error) {
                    console.error('Error:', error);
                    showSuccess();
                    form.reset();
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Зареєструватися';
                }
            }
        });

        function showSuccess() {
            const formContainer = document.querySelector('.form');
            const successBlock = document.getElementById('successMessage');
            if (formContainer && successBlock) {
                const currentHeight = formContainer.offsetHeight;
                formContainer.style.height = `${currentHeight}px`;

                formContainer.classList.add('is-success');
                successBlock.style.display = 'flex';
            }
        }

        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('invalid');
            });
            if (input.type === 'checkbox') {
                input.addEventListener('change', () => {
                    input.classList.remove('invalid');
                });
            }
        });
    }
});
