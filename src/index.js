import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { inputRef, countryListRef, countryInfoRef } from './refs';

const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const query = e.target.value.trim();
  if (query === '') {
    clearInnerHTML(countryListRef);
    clearInnerHTML(countryInfoRef);
    return;
  }

  fetchCountries(query).then(renderMarkup).catch(notify);
}

function clearInnerHTML(el) {
  el.innerHTML = '';
}

function renderMarkup(array) {
  if (array.length === 1) {
    clearInnerHTML(countryListRef);
    renderInfoMarkup(array);
    return;
  }

  if (array.length > 1 && array.length <= 10) {
    clearInnerHTML(countryInfoRef);
    renderListMarkup(array);
    return;
  }

  if (array.length > 10) {
    throw new Error('Too many matches found');
  }
}

function notify(error) {
  clearInnerHTML(countryListRef);
  clearInnerHTML(countryInfoRef);

  if (error.message === '404') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }

  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function renderListMarkup(array) {
  const markup = array
    .map(el => {
      return `<li class="country-list__item"><img src="${el.flags.svg}" alt="flag of ${el.name.official}" class="country-list__image"><p class="country-list__name">${el.name.official}</p></li>`;
    })
    .join('');

  countryListRef.innerHTML = markup;
}

function renderInfoMarkup(array) {
  const markup = `<div class="country-info__title">
        <img src="${
          array[0].flags.svg
        }" class="country-info__image" alt="flag of " />
        <p class="country-info__name">${array[0].name.official}</p>
      </div>
      <ul class="country-info__list">
        <li class="country-info__item">
          <p class="country-info__text"><span>Capital: </span>${
            array[0].capital
          }</p>
        </li>
        <li class="country-info__item">
          <p class="country-info__text"><span>Population: </span>${
            array[0].population
          }</p>
        </li>
        <li class="country-info__item">
          <p class="country-info__text"><span>Languages: </span>${Object.values(
            array[0].languages
          ).join(', ')}</p>
        </li>
      </ul>`;

  countryInfoRef.innerHTML = markup;
}
