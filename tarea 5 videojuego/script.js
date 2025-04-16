document.addEventListener('DOMContentLoaded', function() {
    // 1. Código del formulario
    const form = document.getElementById('registroForm');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.querySelector('.close-modal');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const correo = document.getElementById('correo').value;
        const nombre = document.getElementById('nombre').value;
        const nacimiento = new Date(document.getElementById('nacimiento').value);
        const torneo = document.getElementById('torneo').value;
        const pago = parseFloat(document.getElementById('pago').value);
        
        if (!correo || !nombre || !nacimiento || !torneo || isNaN(pago)) {
            mostrarModal('Error', 'Por favor complete todos los campos obligatorios.');
            return;
        }
        
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        if (edad < 14) {
            mostrarModal('Error', 'Debes tener al menos 14 años para inscribirte.');
            return;
        }
        
        const costo = 100;
        
        if (pago < costo) {
            const faltante = costo - pago;
            mostrarModal('Pago Insuficiente', `Falta S/ ${faltante.toFixed(2)} para completar el pago.`);
            return;
        }
        
        if (pago > costo) {
            const vuelto = pago - costo;
            mostrarModal('Inscripción Exitosa', `¡Felicidades ${nombre}! Tu inscripción al torneo de ${torneo} ha sido exitosa. Tu vuelto es S/ ${vuelto.toFixed(2)}.`);
        } else {
            mostrarModal('Inscripción Exitosa', `¡Felicidades ${nombre}! Tu inscripción al torneo de ${torneo} ha sido exitosa.`);
        }
    });
    
    function mostrarModal(titulo, mensaje) {
        modalTitle.textContent = titulo;
        modalMessage.textContent = mensaje;
        modal.style.display = 'flex';
    }
    
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 2. Código del juego
    const gameSection = document.getElementById('game-section');
    const gameLink = document.getElementById('game-link');
    const gameBoard = document.getElementById('game-board');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');

    let score = 0;
    let time = 60;
    let gameInterval;
    let level = 1;

    gameLink.addEventListener('click', function(e) {
        e.preventDefault();
        gameSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    backBtn.addEventListener('click', function() {
        gameSection.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetGame();
    });

    startBtn.addEventListener('click', startGame);

    function startGame() {
        resetGame();
        startBtn.disabled = true;
        
        gameInterval = setInterval(() => {
            time--;
            timeDisplay.textContent = time;
            
            if (time <= 0) {
                endGame(false);
            }
        }, 1000);
        
        spawnGarbage();
    }

    function spawnGarbage() {
        if (score >= 10 || time <= 0) return;
        
        const garbage = document.createElement('div');
        garbage.className = 'garbage';
        garbage.style.left = `${Math.random() * 90}%`;
        garbage.style.top = `${Math.random() * 90}%`;
        
        garbage.addEventListener('click', function() {
            score++;
            scoreDisplay.textContent = score;
            this.remove();
            
            if (score >= 10) {
                endGame(true);
            } else {
                spawnGarbage();
            }
        });
        
        gameBoard.appendChild(garbage);
        
        if (time > 0 && score < 10) {
            setTimeout(spawnGarbage, Math.random() * 1500 + 500);
        }
    }

    function endGame(isWin) {
        clearInterval(gameInterval);
        startBtn.disabled = false;
        
        if (isWin) {
            alert(`¡Nivel ${level} completado! ¡Felicidades!`);
            level++;
            time = 60 - (level * 5);
            startGame();
        } else {
            alert(`¡Tiempo agotado! Recolectaste ${score}/10. Intenta de nuevo.`);
        }
    }

    function resetGame() {
        clearInterval(gameInterval);
        gameBoard.innerHTML = '';
        score = 0;
        time = 60;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        startBtn.disabled = false;
    }
});