import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
let items = [];

const getCounrtriesItem = ({ flags, name }) =>
  `<li class = "country-item">
  <img src=${flags.svg} alt="Флаг" height="50px" width="50px" />
  <p class = "country-item_text">${name.official}</p>
  </li>`;

const getCounrtryItem = ({ name, capital, population, flags, languages }) =>
  `<ul class="country-desc-list">
      <li class="country-desc-item country-desc-item_name">
        <img src=${flags.svg} alt="Флаг" height="60px" width="60px"/>
        <p class="country-desc-name">${name.official}</p>
      </li>

      <li class="country-desc-item">
      <p class="country-desc-item_info-text">Capital:&nbsp</p>
      <span class="country-desc-item_info">${capital}</span>
      </li>

      <li class="country-desc-item">
      <p class="country-desc-item_info-text">Population:&nbsp</p>
      <span class="country-desc-item_info">${population}</span>
      </li>

      <li class="country-desc-item">
       <p class="country-desc-item_info-text">Languages:&nbsp</p>
      <span class="country-desc-item_info">${Object.values(languages)}</span>
      </li>
    </ul>`;

const renderList = () => {
  const list = items.map(getCounrtriesItem);
  refs.countryListEl.insertAdjacentHTML('beforeend', list.join(''));
};

const renderCountry = () => {
  const list = items.map(getCounrtryItem);
  refs.countryInfoEl.insertAdjacentHTML('beforeend', list.join(''));
};

function clearMarkup() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

function inputCountryName(e) {
  let valueInput = e.target.value.trim();
  clearMarkup();

  if (!valueInput) {
    return;
  }

  fetchCountries(valueInput)
    .then(country => {
      items = country;
      const countryLength = country.length;

      if (countryLength > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (countryLength >= 2 && countryLength <= 10) {
        renderList();
        return;
      } else if (countryLength === 1) {
        renderCountry();
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

refs.inputEl.addEventListener(
  'input',
  debounce(inputCountryName, DEBOUNCE_DELAY)
);
