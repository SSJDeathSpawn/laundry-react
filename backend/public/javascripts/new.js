function copyToClipboard() {
    fetch("/copy").then(response => {
        response.text().then(text => {
            console.log(text);
            navigator.clipboard.writeText(text);
        });
    });
}
