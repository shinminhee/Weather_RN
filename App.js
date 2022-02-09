import * as Location from "expo-location";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { startDetecting } from "react-native/Libraries/Utilities/PixelRatio";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const SCREEN_WIDTH = Dimensions.get("window").width; 위아래 같은 코드임 !!

const API_KEY = "be64059622e1eed3756ade477a36442a"

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Snow": "snowflake"
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {    
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`) 
    setDays(json.daily)
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        indicatorStyle="white"
        // showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
          <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
        </View> 
        ) : (
          days.map((day, index) => ( 
            <View key={index} style={styles.day}>
             <View style={{ flexDirection: "row", alignItems: "center"}}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={38} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>)
          )
        )} 
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontWeight: "500",
    fontSize: 68,
  },
  weather: {
    // flex: 3,
  },
  day: {
    // flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
  },
  description: {
    marginTop: 30,
    fontSize: 50,
  },
  tinyText: {
    fontSize: 20,
  },
});