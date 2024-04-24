function copyToClipboard(date) {
    fetch(`/history/${date}`).then(res => {
        res.text().then(text => {
            console.log(text);
            navigator.clipboard.writeText(text);
        });
    });
}
