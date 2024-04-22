export async function searchWeather(cityName, admName)
{
  let key = "e478337e87904cb8b8ecaaaddd027f8c"; // 引号中放入前面保存的key 
  // 获取城市的ID
  let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${cityName}&${admName}&key=${key}`;
  let res = await fetch(httpUrl);
  let result = await res.json();
  if (result.location && result.location.length > 0) 
  {
    let id = result.location[0].id;
    console.log(id);
    // 根据城市id获取具体的天气
    let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key}`;
    let res1 = await fetch(httpUrl1);
    let result1 = await res1.json();
    let now = result1.now;
    const iconsIndex= 'qi-'+now.icon+"-fill";
    const weather = now.temp;
    console.log(iconsIndex);
    return {
        icon:iconsIndex,
        weather: weather
    }
    } 
  else 
  {
    console.error('未找到该城市信息');
  } 
}