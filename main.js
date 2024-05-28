document.addEventListener('DOMContentLoaded', () => {
    const brothSelect = document.getElementById('broths');
    const proteinSelect = document.getElementById('proteins');
    const orderForm = document.getElementById('order-form');
    const orderResult = document.getElementById('order-result');

    // Helper function to fetch and populate select options
    const fetchAndPopulate = async (url, selectElement, itemName) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${itemName}: ${response.statusText}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error(`Invalid ${itemName} data format`);
            }
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error(`Error fetching ${itemName}:`, error);
        }
    };

    // Fetch and populate broths and proteins
    fetchAndPopulate('http://localhost:2020/api/broths', brothSelect, 'broths');
    fetchAndPopulate('http://localhost:2020/api/proteins', proteinSelect, 'proteins');

    // Handle form submission
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const broth = brothSelect.value;
        const protein = proteinSelect.value;

        try {
            const response = await fetch('http://localhost:2020/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ broth, protein }),
            });
            const data = await response.json();
            if (data.error) {
                orderResult.textContent = `Erro: ${data.error}`;
            } else {
                console.log(data)
                orderResult.textContent = `Pedido criado com sucesso! ID do pedido: ${data.orderId}`;
            }
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            orderResult.textContent = 'Erro ao criar o pedido.';
        }
    });
});