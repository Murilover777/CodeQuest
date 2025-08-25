// Variáveis globais
let score = 0;
let level = 1;
let currentChallenge = null;

// Elementos do DOM
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const codeInput = document.getElementById('codeInput');
const output = document.getElementById('output');

// Desafios disponíveis
const challenges = {
    1: {
        title: "Primeiro HTML",
        description: "Crie uma página HTML simples com um título e um parágrafo",
        template: `<!DOCTYPE html>
<html>
<head>
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá Mundo!</h1>
    <p>Esta é minha primeira página HTML!</p>
</body>
</html>`,
        hint: "Use as tags <h1> para título e <p> para parágrafo",
        check: (code) => {
            return code.includes('<h1>') && code.includes('<p>') && code.includes('</html>');
        }
    },
    2: {
        title: "Estilizando com CSS",
        description: "Adicione CSS para estilizar sua página HTML",
        template: `<!DOCTYPE html>
<html>
<head>
    <title>Página Estilizada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            text-align: center;
        }
        h1 {
            color: #333;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            color: #666;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <h1>Página Colorida!</h1>
    <p>Esta página tem cores e estilos!</p>
</body>
</html>`,
        hint: "Use a tag <style> dentro do <head> para adicionar CSS",
        check: (code) => {
            return code.includes('<style>') && code.includes('color:') && code.includes('background-color:');
        }
    },
    3: {
        title: "Layout Flexbox",
        description: "Crie um layout usando CSS Flexbox para organizar elementos",
        template: `<!DOCTYPE html>
<html>
<head>
    <title>Layout Flexbox</title>
    <style>
        .container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            min-height: 300px;
            background: linear-gradient(45deg, #667eea, #764ba2);
        }
        .box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box">
            <h3>Caixa 1</h3>
            <p>Primeira caixa</p>
        </div>
        <div class="box">
            <h3>Caixa 2</h3>
            <p>Segunda caixa</p>
        </div>
        <div class="box">
            <h3>Caixa 3</h3>
            <p>Terceira caixa</p>
        </div>
    </div>
</body>
</html>`,
        hint: "Use display: flex para criar um layout flexível",
        check: (code) => {
            return code.includes('display: flex') && code.includes('justify-content:') && code.includes('align-items:');
        }
    },
    4: {
        title: "Animações CSS",
        description: "Adicione animações CSS para fazer elementos se moverem",
        template: `<!DOCTYPE html>
<html>
<head>
    <title>Animações CSS</title>
    <style>
        .animated-box {
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            animation: bounce 2s infinite;
            margin: 50px auto;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-50px); }
        }
        
        .rotating-text {
            text-align: center;
            font-size: 24px;
            color: #667eea;
            animation: rotate 3s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="animated-box"></div>
    <div class="rotating-text">Texto Girando!</div>
</body>
</html>`,
        hint: "Use @keyframes para criar animações personalizadas",
        check: (code) => {
            return code.includes('@keyframes') && code.includes('animation:') && code.includes('transform:');
        }
    }
};

// Função para executar o código
function runCode() {
    const code = codeInput.value.trim();
    
    if (!code) {
        showOutput('Digite algum código primeiro!', 'error');
        return;
    }

    // Verificar se é um desafio ativo
    if (currentChallenge && challenges[currentChallenge]) {
        const challenge = challenges[currentChallenge];
        
        if (challenge.check(code)) {
            // Desafio completado!
            score += 100;
            level = Math.floor(score / 300) + 1;
            
            updateScore();
            unlockAchievement(currentChallenge);
            
            showOutput(`
                <div class="success">🎉 Parabéns! Desafio "${challenge.title}" completado!</div>
                <p>Você ganhou 100 pontos!</p>
                <p>Seu código HTML foi executado com sucesso:</p>
                <div class="highlight">${code}</div>
            `);
            
            // Executar o código HTML
            executeHTML(code);
        } else {
            showOutput(`
                <div class="error">❌ Ops! Desafio não completado ainda.</div>
                <p><strong>Dica:</strong> ${challenge.hint}</p>
                <p>Tente novamente!</p>
            `);
        }
    } else {
        // Execução livre do código
        showOutput(`
            <p>Executando seu código...</p>
            <div class="highlight">${code}</div>
        `);
        
        executeHTML(code);
        
        // Dar pontos por tentativa
        score += 10;
        updateScore();
    }
}

// Função para executar HTML
function executeHTML(htmlCode) {
    try {
        // Criar um iframe para executar o HTML de forma segura
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '300px';
        iframe.style.border = '2px solid #667eea';
        iframe.style.borderRadius = '10px';
        iframe.style.background = 'white';
        
        // Limpar output anterior
        output.innerHTML = '';
        
        // Adicionar o iframe
        output.appendChild(iframe);
        
        // Escrever o HTML no iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();
        
    } catch (error) {
        showOutput(`
            <div class="error">❌ Erro ao executar o código:</div>
            <p>${error.message}</p>
        `);
    }
}

// Função para mostrar output
function showOutput(content) {
    output.innerHTML = content;
}

// Função para carregar um desafio
function loadChallenge(challengeNumber) {
    if (challenges[challengeNumber]) {
        currentChallenge = challengeNumber;
        const challenge = challenges[challengeNumber];
        
        // Limpar output
        showOutput(`
            <h3>🎯 ${challenge.title}</h3>
            <p><strong>Descrição:</strong> ${challenge.description}</p>
            <p><strong>Dica:</strong> ${challenge.hint}</p>
            <div class="highlight">Template inicial carregado no editor!</div>
        `);
        
        // Carregar template no editor
        codeInput.value = challenge.template;
        
        // Destacar o desafio selecionado
        document.querySelectorAll('.challenge').forEach(ch => {
            ch.style.borderColor = '#e0e0e0';
        });
        
        event.target.closest('.challenge').style.borderColor = '#667eea';
        event.target.closest('.challenge').style.transform = 'scale(1.02)';
    }
}

// Função para atualizar pontuação
function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    
    // Salvar no localStorage
    localStorage.setItem('codequest_score', score);
    localStorage.setItem('codequest_level', level);
}

// Função para desbloquear conquistas
function unlockAchievement(challengeNumber) {
    const achievementElements = document.querySelectorAll('.achievement');
    
    if (challengeNumber === 1 && !achievementElements[0].classList.contains('unlocked')) {
        achievementElements[0].classList.remove('locked');
        achievementElements[0].classList.add('unlocked');
        achievementElements[0].querySelector('.achievement-icon').textContent = '🎉';
        achievementElements[0].querySelector('.achievement-text').textContent = 'Primeiro Código';
    } else if (challengeNumber === 2 && !achievementElements[1].classList.contains('unlocked')) {
        achievementElements[1].classList.remove('locked');
        achievementElements[1].classList.add('unlocked');
        achievementElements[1].querySelector('.achievement-icon').textContent = '🏆';
        achievementElements[1].querySelector('.achievement-text').textContent = 'Mestre HTML';
    } else if (challengeNumber === 3 && !achievementElements[2].classList.contains('unlocked')) {
        achievementElements[2].classList.remove('locked');
        achievementElements[2].classList.add('unlocked');
        achievementElements[2].querySelector('.achievement-icon').textContent = '🎨';
        achievementElements[2].querySelector('.achievement-text').textContent = 'Artista CSS';
    }
}

// Função para resetar o jogo
function resetGame() {
    score = 0;
    level = 1;
    currentChallenge = null;
    updateScore();
    
    // Resetar conquistas
    document.querySelectorAll('.achievement').forEach(achievement => {
        achievement.classList.remove('unlocked');
        achievement.classList.add('locked');
        achievement.querySelector('.achievement-icon').textContent = '🔒';
    });
    
    // Limpar editor e output
    codeInput.value = '';
    showOutput('<p>Bem-vindo ao CodeQuest! Digite código e veja a mágica acontecer!</p>');
    
    // Limpar seleção de desafios
    document.querySelectorAll('.challenge').forEach(ch => {
        ch.style.borderColor = 'transparent';
        ch.style.transform = 'none';
    });
}

// Carregar pontuação salva
function loadSavedProgress() {
    const savedScore = localStorage.getItem('codequest_score');
    const savedLevel = localStorage.getItem('codequest_level');
    
    if (savedScore) {
        score = parseInt(savedScore);
        level = parseInt(savedLevel);
        updateScore();
    }
}

// Adicionar botão de reset
function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Resetar Jogo';
    resetBtn.className = 'run-btn';
    resetBtn.style.marginLeft = '10px';
    resetBtn.onclick = resetGame;
    
    document.querySelector('.score-board').appendChild(resetBtn);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadSavedProgress();
    addResetButton();
    
    // Adicionar atalhos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            runCode();
        }
    });
    
    // Mostrar mensagem de boas-vindas
    showOutput(`
        <h2>🚀 Bem-vindo ao CodeQuest!</h2>
        <p>Este é um jogo para aprender programação com HTML e CSS!</p>
        <p><strong>Como jogar:</strong></p>
        <ul>
            <li>🎯 Escolha um desafio clicando nos cards</li>
            <li>💻 Digite seu código no editor</li>
            <li>▶️ Clique em "Executar" para ver o resultado</li>
            <li>🏆 Complete desafios para ganhar pontos e conquistas</li>
        </ul>
        <p><strong>Dica:</strong> Use Ctrl+Enter para executar o código rapidamente!</p>
    `);
});

// Adicionar efeitos de partículas no fundo (opcional)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Adicionar CSS para partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);

// Criar partículas quando a página carregar
setTimeout(createParticles, 1000);
