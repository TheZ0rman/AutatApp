document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.config-container')) {
        initConfigPage();
    } else if (document.querySelector('.menu-container')) {
        initMenuPage();
    } else if (window.location.pathname.includes('suma.html')) {
        initSumaGame();
    } else if (window.location.pathname.includes('profile.html')) {
        initProfilePage();
    }
});

// ========== Config Page ==========
function initConfigPage() {
    const avatarList = [
        "avatar1","avatar2","avatar3","avatar4",
        "avatar5","avatar6","avatar7","avatar8","avatar9"
    ];

    const savedTema = localStorage.getItem("tema") || "pastel";
    const savedColor = localStorage.getItem("color") || "verde";
    const savedNombre = localStorage.getItem("nombre") || "";
    const savedSonidos = localStorage.getItem("sonidos") || "true";
    const savedAvatar = localStorage.getItem("avatar") || avatarList[0];

    const nombreInput = document.getElementById("nombre");
    const sonidosCheckbox = document.getElementById("sonidos");

    nombreInput.value = savedNombre;
    sonidosCheckbox.checked = savedSonidos === "true";

    // Renderizar carrusel de avatares
    const track = document.getElementById("avatar-track");
    function renderAvatars() {
        track.innerHTML = "";
        avatarList.forEach(id => {
            const item = document.createElement("div");
            item.className = "avatar-item";
            const img = document.createElement("img");
            img.src = `assets/img/avatars/${id}.png`;
            img.alt = id;
            img.dataset.avatar = id;
            if (id === savedAvatar) img.classList.add("selected");
            img.addEventListener("click", () => {
                document.querySelectorAll(".avatar-item img").forEach(i => i.classList.remove("selected"));
                img.classList.add("selected");
                img.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
            item.appendChild(img);
            track.appendChild(item);
        });
        const initial = track.querySelector(`img[data-avatar="${savedAvatar}"]`);
        if (initial) initial.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    }
    renderAvatars();

    // Botones del carrusel
    const prevBtn = document.getElementById("avatar-prev");
    const nextBtn = document.getElementById("avatar-next");
    prevBtn.addEventListener("click", () => track.scrollBy({ left: -120, behavior: "smooth" }));
    nextBtn.addEventListener("click", () => track.scrollBy({ left: 120, behavior: "smooth" }));

    // Activar tema y color guardados
    const temaBtnSaved = document.querySelector(`[data-tema="${savedTema}"]`);
    if (temaBtnSaved) temaBtnSaved.classList.add("active");

    const colorBtnSaved = document.querySelector(`[data-color="${savedColor}"]`);
    if (colorBtnSaved) colorBtnSaved.classList.add("active");

    // Aplicar estilos iniciales
    applyAccentColor(savedColor);
    applyTheme(savedTema);

    // Manejar cambio de tema
    document.querySelectorAll("[data-tema]").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll("[data-tema]").forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");
            applyTheme(boton.dataset.tema);
        });
    });

    // Manejar cambio de color
    document.querySelectorAll("[data-color]").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll("[data-color]").forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");
            applyAccentColor(boton.dataset.color);
        });
    });

    // Guardar configuración y redirigir
    document.getElementById("guardar").addEventListener("click", (e) => {
        e.preventDefault();
        const nombre = nombreInput.value.trim();
        if (!nombre) {
            alert("Por favor ingresa un nombre");
            return;
        }

        const tema = document.querySelector("[data-tema].active")?.dataset.tema || "pastel";
        const color = document.querySelector("[data-color].active")?.dataset.color || "verde";
        const sonidos = sonidosCheckbox.checked;
        const avatar = document.querySelector(".avatar-item img.selected")?.dataset.avatar || avatarList[0];

        // Guardar configuración
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("tema", tema);
        localStorage.setItem("color", color);
        localStorage.setItem("sonidos", sonidos);
        localStorage.setItem("avatar", avatar);

        // Inicializar estadísticas si no existen
        if (!localStorage.getItem("stats")) {
            const initialStats = {
                sumas: { correctas: 0, incorrectas: 0 },
                restas: { correctas: 0, incorrectas: 0 },
                multiplicacion: { correctas: 0, incorrectas: 0 },
                division: { correctas: 0, incorrectas: 0 },
                totalActividades: 0,
                totalCorrectas: 0
            };
            localStorage.setItem("stats", JSON.stringify(initialStats));
        }

        // ir al menú
        window.location.href = "menu.html";
    });
}
// En la función initMenuPage (reemplazar la anterior)
function initMenuPage() {
    const nombre = localStorage.getItem("nombre") || "Niño";
    const avatar = localStorage.getItem("avatar") || "avatar1";
    const tema = localStorage.getItem("tema") || "pastel";
    const color = localStorage.getItem("color") || "verde";
    const stats = JSON.parse(localStorage.getItem("stats")) || {
        sumas: { correctas: 0, incorrectas: 0 },
        restas: { correctas: 0, incorrectas: 0 },
        multiplicacion: { correctas: 0, incorrectas: 0 },
        division: { correctas: 0, incorrectas: 0 },
        totalActividades: 0
    };

    applyTheme(tema);
    applyAccentColor(color);

    // Mostrar datos del usuario
    document.getElementById("menu-nombre").textContent = nombre;
    document.getElementById("menu-avatar").src = `assets/img/avatars/${avatar}.png`;
    document.getElementById("nombre-usuario").textContent = nombre;
    document.getElementById("actividades-count").textContent = stats.totalActividades;

    // Elementos del menú
    const profileBtn = document.getElementById("profile-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    const overlay = document.getElementById("overlay");
    const statsBtn = document.getElementById("stats-btn");
    const avatarBtn = document.getElementById("avatar-btn");
    const colorsBtn = document.getElementById("colors-btn");
    const statsPanel = document.getElementById("stats-panel");
    const avatarPanel = document.getElementById("avatar-panel");
    const colorsPanel = document.getElementById("colors-panel");
    const closeStats = document.getElementById("close-stats");
    const closeAvatar = document.getElementById("close-avatar");
    const closeColors = document.getElementById("close-colors");
    const saveAvatarBtn = document.getElementById("save-avatar");
    const saveColorsBtn = document.getElementById("save-colors");
    const avatarOptions = document.getElementById("avatar-options");

    // Mostrar estadísticas
    document.getElementById("sumas-correctas").textContent = stats.sumas.correctas;
    document.getElementById("sumas-incorrectas").textContent = stats.sumas.incorrectas;
    document.getElementById("restas-correctas").textContent = stats.restas.correctas;
    document.getElementById("restas-incorrectas").textContent = stats.restas.incorrectas;
    document.getElementById("multiplicacion-correctas").textContent = stats.multiplicacion.correctas;
    document.getElementById("multiplicacion-incorrectas").textContent = stats.multiplicacion.incorrectas;
    document.getElementById("division-correctas").textContent = stats.division.correctas;
    document.getElementById("division-incorrectas").textContent = stats.division.incorrectas;

    // Toggle del menú desplegable
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
        profileBtn.classList.toggle("active");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", () => {
        profileDropdown.style.display = "none";
        profileBtn.classList.remove("active");
    });

    // Mostrar panel de estadísticas
    statsBtn.addEventListener("click", () => {
        profileDropdown.style.display = "none";
        profileBtn.classList.remove("active");
        overlay.style.display = "block";
        statsPanel.style.display = "block";
    });

    // Mostrar panel de avatar
    avatarBtn.addEventListener("click", () => {
        profileDropdown.style.display = "none";
        profileBtn.classList.remove("active");
        overlay.style.display = "block";
        avatarPanel.style.display = "block";
        
        // Cargar opciones de avatar
        avatarOptions.innerHTML = "";
        const avatarList = [
            "avatar1","avatar2","avatar3","avatar4",
            "avatar5","avatar6","avatar7","avatar8","avatar9"
        ];
        
        avatarList.forEach(avatar => {
            const avatarOption = document.createElement("div");
            avatarOption.className = "avatar-option";
            if (avatar === localStorage.getItem("avatar")) {
                avatarOption.classList.add("selected");
            }
            
            const img = document.createElement("img");
            img.src = `assets/img/avatars/${avatar}.png`;
            img.alt = avatar;
            img.dataset.avatar = avatar;
            
            avatarOption.appendChild(img);
            avatarOptions.appendChild(avatarOption);
            
            img.addEventListener("click", () => {
                document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("selected"));
                avatarOption.classList.add("selected");
            });
        });
    });

    // Mostrar panel de colores
    colorsBtn.addEventListener("click", () => {
        profileDropdown.style.display = "none";
        profileBtn.classList.remove("active");
        overlay.style.display = "block";
        colorsPanel.style.display = "block";
        
        // Activar tema y color guardados
        document.querySelectorAll("[data-tema]").forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-tema="${localStorage.getItem("tema") || "pastel"}"]`).classList.add("active");
        
        document.querySelectorAll("[data-color]").forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-color="${localStorage.getItem("color") || "verde"}"]`).classList.add("active");
    });

    // Cerrar paneles
    closeStats.addEventListener("click", closeAllPanels);
    closeAvatar.addEventListener("click", closeAllPanels);
    closeColors.addEventListener("click", closeAllPanels);
    overlay.addEventListener("click", closeAllPanels);

    // Guardar avatar
    saveAvatarBtn.addEventListener("click", () => {
        const selectedAvatar = document.querySelector(".avatar-option.selected img")?.dataset.avatar;
        if (selectedAvatar) {
            localStorage.setItem("avatar", selectedAvatar);
            document.getElementById("menu-avatar").src = `assets/img/avatars/${selectedAvatar}.png`;
            closeAllPanels();
        }
    });

    // Guardar colores
    saveColorsBtn.addEventListener("click", () => {
        const tema = document.querySelector("[data-tema].active")?.dataset.tema || "pastel";
        const color = document.querySelector("[data-color].active")?.dataset.color || "verde";
        
        localStorage.setItem("tema", tema);
        localStorage.setItem("color", color);
        
        applyTheme(tema);
        applyAccentColor(color);
        closeAllPanels();
    });

    // Manejar cambio de tema en el panel
    document.querySelectorAll("[data-tema]").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll("[data-tema]").forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");
        });
    });

    // Manejar cambio de color en el panel
    document.querySelectorAll("[data-color]").forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll("[data-color]").forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");
        });
    });

    function closeAllPanels() {
        overlay.style.display = "none";
        statsPanel.style.display = "none";
        avatarPanel.style.display = "none";
        colorsPanel.style.display = "none";
    }

    // Activar navegación de actividades
    document.querySelectorAll(".actividad").forEach(actividad => {
        actividad.addEventListener("click", () => {
            const tipoActividad = actividad.dataset.actividad;
            window.location.href = `actividades/${tipoActividad}.html`;
        });
    });
}

// ========== Profile Page ==========
function initProfilePage() {
    const nombre = localStorage.getItem("nombre") || "Niño";
    const avatar = localStorage.getItem("avatar") || "avatar1";
    const tema = localStorage.getItem("tema") || "pastel";
    const color = localStorage.getItem("color") || "verde";
    const stats = JSON.parse(localStorage.getItem("stats")) || {
        sumas: { correctas: 0, incorrectas: 0 },
        restas: { correctas: 0, incorrectas: 0 },
        multiplicacion: { correctas: 0, incorrectas: 0 },
        division: { correctas: 0, incorrectas: 0 }
    };

    applyTheme(tema);
    applyAccentColor(color);

    // Mostrar datos del usuario
    document.getElementById("profile-name").textContent = nombre;
    document.getElementById("profile-avatar").src = `assets/img/avatars/${avatar}.png`;

    // Mostrar estadísticas
    document.getElementById("sumas-correctas").textContent = stats.sumas.correctas;
    document.getElementById("sumas-incorrectas").textContent = stats.sumas.incorrectas;
    document.getElementById("restas-correctas").textContent = stats.restas.correctas;
    document.getElementById("restas-incorrectas").textContent = stats.restas.incorrectas;
    document.getElementById("multiplicacion-correctas").textContent = stats.multiplicacion.correctas;
    document.getElementById("multiplicacion-incorrectas").textContent = stats.multiplicacion.incorrectas;
    document.getElementById("division-correctas").textContent = stats.division.correctas;
    document.getElementById("division-incorrectas").textContent = stats.division.incorrectas;

    // Configurar modal de avatar
    const avatarModal = document.getElementById("avatar-modal");
    const avatarOptions = document.getElementById("avatar-options");
    const saveAvatarBtn = document.getElementById("save-avatar");
    const changeAvatarBtn = document.getElementById("change-avatar");

    const avatarList = [
        "avatar1","avatar2","avatar3","avatar4",
        "avatar5","avatar6","avatar7","avatar8","avatar9"
    ];

    // Renderizar opciones de avatar
    avatarList.forEach(avatar => {
        const avatarOption = document.createElement("div");
        avatarOption.className = "avatar-option";
        if (avatar === localStorage.getItem("avatar")) {
            avatarOption.classList.add("selected");
        }
        
        const img = document.createElement("img");
        img.src = `assets/img/avatars/${avatar}.png`;
        img.alt = avatar;
        img.dataset.avatar = avatar;
        
        avatarOption.appendChild(img);
        avatarOptions.appendChild(avatarOption);
        
        img.addEventListener("click", () => {
            document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("selected"));
            avatarOption.classList.add("selected");
        });
    });

    changeAvatarBtn.addEventListener("click", () => {
        avatarModal.style.display = "flex";
    });

    saveAvatarBtn.addEventListener("click", () => {
        const selectedAvatar = document.querySelector(".avatar-option.selected img")?.dataset.avatar;
        if (selectedAvatar) {
            localStorage.setItem("avatar", selectedAvatar);
            document.getElementById("profile-avatar").src = `assets/img/avatars/${selectedAvatar}.png`;
            avatarModal.style.display = "none";
        }
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
        if (e.target === avatarModal) {
            avatarModal.style.display = "none";
        }
    });
}
// ========== Suma Game ==========
function initSumaGame() {
    // Configuración inicial
    const tema = localStorage.getItem("tema") || "pastel";
    const color = localStorage.getItem("color") || "verde";
    const nombre = localStorage.getItem("nombre") || "Niño";
    const avatar = localStorage.getItem("avatar") || "avatar1";
    const sonidosActivados = localStorage.getItem("sonidos") === "true";

    applyTheme(tema);
    applyAccentColor(color);

    // Mostrar datos del usuario
    document.getElementById("menu-nombre").textContent = nombre;
    document.getElementById("menu-avatar").src = `assets/img/avatars/${avatar}.png`;

    // Elementos del juego
    const num1Element = document.getElementById("num1");
    const num2Element = document.getElementById("num2");
    const answerInput = document.getElementById("answer");
    const checkBtn = document.getElementById("check-btn");
    const nextBtn = document.getElementById("next-btn");
    const helpBtn = document.getElementById("help-btn");
    const resultMessage = document.getElementById("result-message");
    const pointsElement = document.getElementById("points");
    const stars = document.querySelectorAll(".star");
    const counters1 = document.getElementById("counters1");
    const counters2 = document.getElementById("counters2");
    const levelButtons = document.querySelectorAll(".level-btn");
    const numButtons = document.querySelectorAll(".num-btn");
    const clearBtn = document.getElementById("clear-btn");
    const timerContainer = document.getElementById("timer-container");
    const timerBar = document.getElementById("timer-bar");

    // Variables del juego
    let currentLevel = 1;
    let num1 = 0;
    let num2 = 0;
    let correctAnswer = 0;
    let exercisesCompleted = 0;
    let timer;
    let timeLeft = 60;

    // Niveles de dificultad
    const levels = {
        1: { min: 1, max: 5 },
        2: { min: 3, max: 8 },
        3: { min: 5, max: 10 }
    };

    // Iniciar juego
    initGame();

    // Event listeners
    checkBtn.addEventListener("click", checkAnswer);
    nextBtn.addEventListener("click", nextExercise);
    helpBtn.addEventListener("click", showHelp);
    answerInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") checkAnswer();
    });
    
    levelButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentLevel = parseInt(btn.dataset.level);
            levelButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            initGame();
        });
    });

    numButtons.forEach(btn => {
        if (btn.id !== "clear-btn") {
            btn.addEventListener("click", () => {
                answerInput.value += btn.textContent;
            });
        }
    });

    clearBtn.addEventListener("click", () => {
        answerInput.value = "";
    });

    // Funciones del juego
    function initGame() {
        exercisesCompleted = 0;
        
        if (currentLevel === 3) {
            timerContainer.style.display = "block";
            timeLeft = 60;
        } else {
            timerContainer.style.display = "none";
            clearInterval(timer);
        }
        
        generateExercise();
        levelButtons.forEach(btn => {
            if (parseInt(btn.dataset.level) === currentLevel) {
                btn.classList.add("active");
            }
        });
    }

    function generateExercise() {
        const level = levels[currentLevel];
        
        if (currentLevel === 2 && Math.random() > 0.5) {
            num1 = getRandomInt(level.min + 2, level.max + 3);
            num2 = getRandomInt(level.min + 2, level.max + 3);
        } else {
            num1 = getRandomInt(level.min, level.max);
            num2 = getRandomInt(level.min, level.max);
        }
        
        correctAnswer = num1 + num2;
        
        num1Element.textContent = num1;
        num2Element.textContent = num2;
        answerInput.value = "";
        answerInput.focus();
        
        resultMessage.textContent = "";
        resultMessage.className = "";
        nextBtn.style.display = "none";
        checkBtn.style.display = "inline-block";
        
        createCounters(counters1, num1);
        createCounters(counters2, num2);
        
        if (currentLevel === 3) {
            startTimer();
        } else {
            clearInterval(timer);
        }
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;
        timerBar.style.width = "100%";
        timerBar.style.backgroundColor = "var(--color-primary)";
        timerBar.classList.remove("time-warning");
        
        timer = setInterval(() => {
            timeLeft--;
            const percentage = (timeLeft / 60) * 100;
            timerBar.style.width = `${percentage}%`;
            
            if (timeLeft <= 10 && timeLeft > 0) {
                timerBar.classList.add("time-warning");
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                resultMessage.textContent = `¡Tiempo! La respuesta es ${correctAnswer}`;
                resultMessage.className = "wrong";
                checkBtn.style.display = "none";
                nextBtn.style.display = "inline-block";
                updateStats(false);
            }
        }, 1000);
    }

    function createCounters(container, count) {
        container.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const counter = document.createElement("div");
            counter.className = "counter";
            counter.textContent = i + 1;
            container.appendChild(counter);
        }
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            resultMessage.textContent = "¡Escribe un número!";
            resultMessage.className = "wrong";
            return;
        }
        
        exercisesCompleted++;
        
        if (currentLevel === 3) {
            clearInterval(timer);
        }
        
        if (userAnswer === correctAnswer) {
            resultMessage.textContent = "¡Correcto! 🎉";
            resultMessage.className = "correct";
            updateStats(true);
        } else {
            resultMessage.textContent = `¡Oops! La respuesta es ${correctAnswer}`;
            resultMessage.className = "wrong";
            updateStats(false);
        }
        
        checkBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
    }

    function updateStats(isCorrect) {
        const stats = JSON.parse(localStorage.getItem("stats")) || {
            sumas: { correctas: 0, incorrectas: 0 },
            restas: { correctas: 0, incorrectas: 0 },
            multiplicacion: { correctas: 0, incorrectas: 0 },
            division: { correctas: 0, incorrectas: 0 },
            totalActividades: 0,
            totalCorrectas: 0
        };

        stats.totalActividades += 1;
        
        if (isCorrect) {
            stats.sumas.correctas += 1;
            stats.totalCorrectas += 1;
        } else {
            stats.sumas.incorrectas += 1;
        }

        localStorage.setItem("stats", JSON.stringify(stats));
    }

    function nextExercise() {
        generateExercise();
    }

    function showHelp() {
        // Mostrar ayuda
        alert(`Puedes contar los puntos:\n\n${num1} + ${num2} = ${correctAnswer}`);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/* ======= Helpers visuales ======= */

function applyTheme(tema) {
    const body = document.body;
    switch (tema) {
        case "pastel":
            body.style.backgroundColor = "#E2F0F9";
            body.style.color = "#5E548E";
            break;
        case "rosa":
            body.style.backgroundColor = "#ffc9e7";
            body.style.color = "";
            break;
        case "azul":
            body.style.backgroundColor = "#D6EAF8";
            body.style.color = "";
            break;
        case "arena":
            body.style.backgroundColor = "#FDEBD0";
            body.style.color = "";
            break;
        case "lavanda":
            body.style.backgroundColor = "#EBDEF0";
            body.style.color = "";
            break;
        case "contraste":
            body.style.backgroundColor = "#474747ff";
            body.style.color = "";
            break;
        default:
            body.style.backgroundColor = "";
            body.style.color = "";
    }
}

function applyAccentColor(color) {
    let colorPrimario;
    switch (color) {
        case "azul": colorPrimario = "#5DADE2"; break;
        case "naranja": colorPrimario = "#F5B041"; break;
        case "morado": colorPrimario = "#9B59B6"; break;
        case "rojo": colorPrimario = "#EC7063"; break;
        case "turquesa": colorPrimario = "#48C9B0"; break;
        case "verde":
        default: colorPrimario = "#84A59D";
    }

    document.documentElement.style.setProperty('--color-primary', colorPrimario);

    const elementsToUpdate = [
        { selector: '.welcome-panel', property: 'background', value: `linear-gradient(135deg, ${colorPrimario}, ${lightenColor(colorPrimario, 20)})` },
        { selector: '.user-header', property: 'backgroundColor', value: colorPrimario },
        { selector: '.btn-guardar', property: 'backgroundColor', value: colorPrimario },
        { selector: '.activities-panel h2', property: 'color', value: colorPrimario }
    ];

    elementsToUpdate.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(el => el.style[item.property] = item.value);
    });
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
}