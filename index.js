// get the buttons
const oneDay = document.getElementById("1d");
const sevenDay = document.getElementById("7d");

let xlabels = [];
let ylabels = [];
let week = 1;
let hour = 1;
async function getdata(day, interval) {
  hour = 1;
  week = 1;
  return fetch(
    `https://api.coingecko.com/api/v3/coins/checkdot/market_chart?vs_currency=usd&days=${day}&interval=${interval}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.prices.forEach((element, i) => {
        if (day == 7) {
          if (i % 24 == 0) {
            xlabels.push(week);
            week = week + 1;
          } else {
            xlabels.push("");
          }
        } else if (day == 1) {
          console.log("hour is now 1", hour);
          if (i % 60 == 0) {
            console.log("hour is now 60");
            xlabels.push(hour);
            hour++;
          } else {
            xlabels.push("");
          }
        }

        ylabels.push(element[1]);
      });
    });
}

//weekly x-labels
// setup
const data = {
  labels: xlabels,
  datasets: [
    {
      label: "Financial chart",
      data: ylabels,
      pointRadius: 0,
      pointBorderColor: "rgba(255, 99, 132, 1)",
      fill: false,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const options = {
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
      labels: {
        display: false,
      },
    },
    events: [],
  },
  scales: {
    y: {
      type: "linear",
      grid: {
        display: false,
      },
      beginAtZero: false,
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
//create chart
const ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "line",
  data,
  options,
});
//destroy chart
function destroyer() {
  myChart.destroy();
}
//render chart
function render() {
  myChart = new Chart(ctx, {
    type: "line",
    data,
    options,
  });
}

oneDay.addEventListener("click", async (e) => {
  destroyer();
  ylabels.splice(0, ylabels.length);
  xlabels.splice(0, xlabels.length);
  await getdata("1", "minute");
  render();
});
sevenDay.addEventListener("click", async (e) => {
  destroyer();
  ylabels.splice(0, ylabels.length);
  xlabels.splice(0, xlabels.length);
  await getdata("7", "hourly");
  render();
});

//default get 7 days interval hourly
window.onload = getdata("7", "hourly");
