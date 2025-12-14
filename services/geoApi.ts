// Google Apps Script API Service
const DATA_URL = 'https://script.google.com/macros/s/AKfycbzAndq4P9StmPcRuPrSb1eJJ4MducuxfLxLmCqVNh2LzGRYH4xnTuDzQQPYY6_ONnEPVA/exec?action=list';

export async function fetchGeoData() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching geo data:', error);
    return [];
  }
}
