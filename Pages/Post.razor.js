export async function setInnerHtmlFromRequest(id, url) {
  const converter = new showdown.Converter(); 
  const content = await fetch(url);
  const text = await content.text();
  const html = converter.makeHtml(text);
  document.getElementById(id).innerHTML = html;
}
