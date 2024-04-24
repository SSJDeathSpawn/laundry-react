
export default async function History() {

  const items = await fetch('api/history')

  function copyToClipboard(date) {
    fetch(`/history/${date}`).then(res => {
      res.text().then(text => {
        console.log(text);
        navigator.clipboard.writeText(text);
      });
    });
  }

  return (
    <>
      {items.text.map((item) => {
        return (
            <p class="text-xl mb-3 hover:underline hover:cursor-pointer" onClick={copyToClipboard(item.date.getTime())}>{item.total} clothes on {item.date.toLocaleDateString()}</p>
        )
      })}
    </>
  )
}
