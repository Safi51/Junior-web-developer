//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    let apiKey = 'b1388ef842dccdc00654191ce442488d';
    const buttonsDiv = document.getElementById('buttons');
    const inputDiv = document.getElementById('city-input');
    const cityNameDiv = document.getElementById('citynames');
    let apiDaysGlob=null;
    let myChart= null;
    
    function getWeather(){
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${inputDiv.value}&appid=${apiKey}`)
      .then(
          //res это respons ответ
          async function(res){
              apiData = res.data.list;
              //console.log(getApiDays(apiData));
              apiDaysGlob=getApiDays(apiData);
              console.log('inside axios', apiDaysGlob);
          }
      );
    }

    function getCities() {
      axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
          country: "Kazakhstan"
      }).then(res => {
          citiesArr = res.data.data
          console.log(citiesArr)
          setCity(citiesArr)
      })
  }





function drawChat(apiDays, i){
    const labels = [
      //когда в переменную ложишь переменную ставиться 3 точки с переди ...
        ...apiDays[i].time
      ];

      const data = {
        labels: labels,
        datasets: [{
          label: inputDiv.value +apiDays[i].day,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [...apiDays[i].temp],
        }]
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          //responsive процесс иземеннения сама таблица не на всю страницу
          responsive: false
        }
      };

      return new Chart(
        document.getElementById('myChart'),
        config
      );
}

function addbuttons(apiDays){
  for(let i=0; i<apiDays.length;i++){
    buttonsDiv.innerHTML +=
    `
     <button onclick=changeDay('${i}')>${apiDays[i].day}</button>
    `
  }
}


function getApiDays(apiData){
    let apiDays = [];

    for(let i =0; i<apiData.length;){

        let dayTimetemp ={
            day:'',
            time: [],
            temp:[]
        }
        // substring с 0 до 10 взять только эти надписи, если идет больше не надо
        dayTimetemp.day = apiData[i].dt_txt.substring(0, 10);
        
        
        while(apiData[i].dt_txt.substring(0,10) === dayTimetemp.day){
            dayTimetemp.time.push(apiData[i].dt_txt.substring(11));
            dayTimetemp.temp.push(apiData[i].main.temp-273.15);
            i++;

            if(i==apiData.length) break;
        }

        apiDays.push(dayTimetemp);


    }
    if(myChart) myChart.destroy();
    buttonsDiv.innerHTML='';
    myChart =drawChat(apiDays, 0);
    addbuttons(apiDays);
    return apiDays;

}

function changeDay(i){
  console.log(apiDaysGlob);
/*  document.getElementById('myChart').destroy();*/
  myChart.destroy();
  myChart = drawChat(apiDaysGlob, i);

}

function setCity(arr){
  for(let i=0; i<arr.length;i++){
    cityNameDiv.innerHTML +=
    `
    <option value = '${arr[i]}'>
    `
  }
  cityNameDiv
}


getCities();