"use strict"

const baseURL = 'https://restcountries.com/v3.1/';

const countries_list = document.getElementById('countries-list');
const pagination_container = document.getElementById('pagination');
const search_input = document.getElementById('search-input');

// Get All countries
async function getCountries(){
    const response = await fetch(`${baseURL}all`);
    const countries = await response.json();
    createPagination(countries);
    drowCountries(1, '');
}
getCountries();


// Search Countries
async function searchCountries(s_text){
    const response = await fetch(`${baseURL}name/${s_text}`);
    const countries = await response.json();
    drowCountries(0, countries);
}


// Drow countries html
function drowCountries(page_number, s_countries) {
    countries_list.textContent = '';
    let countries = [];

    if(s_countries) {
        countries = s_countries;
    } else {
        const data = localStorage.getItem(`page-${page_number}`);
        countries = JSON.parse(data);
    }
    
    countries.forEach(country => {
        const html = `
            <div class="country-selector">
                <img src="${country.flags.png}" alt="United States Flag" class="flag">
                <span class="country-name">${country.name.common}</span>
            </div> 
        `;
        countries_list.insertAdjacentHTML('beforeend', html);
    });

}

// Calculating Pages count
function calculatePageCount(){
    const total = 250;
    const countries_per_page = 50;
    return Math.ceil(total / countries_per_page);
}


// Create pagination buttons, add countries in per page to localStorage
let from_index = 0;
let to_index = 50;

function createPagination(countries) {
    const pages_count = calculatePageCount();
    for(let i = 0; i < pages_count; i++){
        const button = document.createElement('button');
        if(i == 0) button.classList.add('active');
        
        button.textContent = i + 1;

        pagination_container.append(button);
        from_index = i === 0 ? i : to_index + 1;
        to_index = i === 0 ? to_index : to_index + 50
        const countries_in_page = countries.slice(from_index, to_index);
        localStorage.setItem(`page-${i + 1}`, JSON.stringify(countries_in_page))
    }
}


// Add pagination functionality
pagination_container.addEventListener('click', (e) => {
    if(e.target.localName === 'button'){
        const page = e.target.textContent;
        drowCountries(+page, '');

        // add active page class
        const parent = e.target.parentNode;
        const childrens = parent.children;
        for( let i= 0; i < childrens.length; i++){ 
            if(childrens[i].classList.contains('active')){
                childrens[i].classList.remove('active');
            }
        }
        e.target.classList.add('active');
    }
});


// Search functionality
let typingTimer;
let search_text = '';

search_input.addEventListener('input', (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
     search_text = e.target.value;
        if(search_text.trim() !== ''){
            pagination_container.style.display = 'none';
            searchCountries(search_text);
        } else {
            drowCountries(1, '');
            pagination_container.style.display = 'flex';
        }

    }, 1000);
});
