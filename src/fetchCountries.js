export async function fetchCountries(query) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${query.trim()}?fields=name,population,flags,languages`
  );

  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
}
