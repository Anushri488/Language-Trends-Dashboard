async function fetchData() {
    const response = await fetch('https://anushrimishra.pythonanywhere.com/api/data');
    const data = await response.json();
  
    const years = ['2022', '2023', '2024'];
    const datasets = [];
  
    Object.keys(data).forEach((language, index) => {
      datasets.push({
        label: language,
        data: years.map(year => data[language][year]),
        borderColor: `hsl(${index * 36}, 70%, 50%)`,
        backgroundColor: `hsl(${index * 36}, 70%, 80%)`,
        fill: false,
        tension: 0.3
      });
    });
  
    const ctx = document.getElementById('languageChart').getContext('2d');
  
    const config = {
      type: 'line',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Top 10 Programming Languages Over 2022–2024'
          }
        }
      }
    };
  
    new Chart(ctx, config);
  }
  
  document.addEventListener("DOMContentLoaded", fetchData);
  
