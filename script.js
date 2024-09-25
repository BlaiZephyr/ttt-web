document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const webhookUrl = '';

    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');

    let message = "Got another one!:\n\n";

    Array.from(inputs)
        .filter(input => input.value !== '')
        .forEach(input => {
            message += `${input.name}: ${input.value}\n`;
        });

    if (message.trim() === "") {
        message = "where message?";
    }
    dumpMessage(message);

    const now = Date.now();
    const lastSubmitTime = localStorage.getItem('lastSubmitTime') ? parseInt(localStorage.getItem('lastSubmitTime')) : 0;
    const cooldownDuration = 120 * 1000; // 2 minutes in milliseconds

    if (now - lastSubmitTime < cooldownDuration) {
        alert("please wait 2 minutes.");
        return;
    }

    localStorage.setItem('lastSubmitTime', now);

    if (message.includes('@everyone')) {
        alert("Error: Message contains '@everyone'. Please remove this mention before resubmitting.");
        return;
    }

    try {
        const response = await fetch('http://ttt-client.de/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        alert('Message sent successfully!');
    } catch (error) {
        console.error('Oopsie daisy something went uwu wrong:', error.message);
        if (error instanceof TypeError) {
            console.error('Type-error:', error.stack);
        } else if (error instanceof Error) {
            console.error('error message:', error.message);
        } else {
            console.error('PANIC');
        }
    }
});