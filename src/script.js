function submitForm() {
	var name = document.getElementById("name").value;
	var password = document.getElementById("password").value;

	// Send a POST request to the Azure Function to store the data
	fetch('/api/store-data', {
		method: 'POST',
		body: JSON.stringify({ name: name, password: password }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Failed to store data');
		}
		alert('Data stored successfully');
	})
	.catch(error => {
		console.error(error);
		alert('Failed to store data');
	});
}
