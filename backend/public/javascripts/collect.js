document.getElementById('finish').addEventListener('htmx:confirm', event => {
    console.log(event.detail.elt);
    event.preventDefault();
    event.detail.elt.innerHTML = event.detail.question
    event.detail.elt.addEventListener('click', e => {
        e.preventDefault();
        event.detail.issueRequest(true);
    });
});
