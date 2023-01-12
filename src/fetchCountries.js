export function fetchCountries(query) {
  return fetch(
    `https://restcountries.com/v3.1/name/${query.trim()}?fields=name,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
