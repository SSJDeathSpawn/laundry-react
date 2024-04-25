import { useEffect, useState } from "react";

export default function History() {

  const [items, setItems] = useState([]);


  function copyToClipboard(date) {
    fetch(`/api/history/${date}`).then((res) => {
      res.text().then((text) => {
        if (window.isSecureContext) {
          navigator.clipboard.writeText(text).catch((err) => {
            console.log(err);
          });
        }
      });
    })
  }

  function generateText(item) {
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    const item_count = zip(item.clothes, item.amts)
    const items = item_count.map(pair => {
      return `${pair[0]} ${pair[1]}`
    });
    const text = items.join(', ');
    const final_text = `${item.total} total, ` + text;
    return final_text;
  }

  useEffect(() => {
    async function getData() {
      const prev = await (await fetch('/api/history')).json();
      var result = prev.map((item) => {
        return (
          <p key={item.date} title={generateText(item)} className="text-xl mb-3 hover:underline hover:cursor-pointer" onClick={() => { copyToClipboard(new Date(item.date).getTime()) }}>{item.total} clothes on {new Date(item.date).toLocaleDateString()}</p>
        )
      }
      );
      console.log(result);
      setItems(result);
    }
    getData();
  }, []);

  return <>{items}</>
}
