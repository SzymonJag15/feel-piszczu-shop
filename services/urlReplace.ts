export function urlReplace(url: string): string {
  if (url.includes("pdf")) return url;

  return url
    .replace("https://beta.codeme.pl/", "/")
    .replace("http://shop.codeholic.pl/", "/");
}
