import {useEffect, useState } from 'react';
import {StyleSheet, TouchableOpacity, View, TextInput, Image, FlatList} from 'react-native';
import NbuRate from './types/NbuRates';
import RatesModel from './models/RatesModel';
import rateItem from './components/rateItem';

export default function Rates() {
    const [rates, setRates] = useState<NbuRate[]>([]);
    const [shownRates, setShownRates] = useState([] as Array<NbuRate>);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if(RatesModel.instance.rates.length === 0) {
            console.log("Loading data...");
            fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
                .then(r => r.json())
                .then(j => {
                    console.log("Loaded data:");
                    RatesModel.instance.rates = j;
                    setRates(j);
                });
        }
        else {
            console.log("Used cache data");   
            setRates(RatesModel.instance.rates);
            setShownRates(RatesModel.instance.shownRates);
            setSearchText(RatesModel.instance.searchText || "");
        }
    }, []);
  
    useEffect(() => {
      if(searchText.length > 0) {
        setShownRates(rates.filter(rate => rate.cc.includes(searchText)));
      }
      else {
        setShownRates(rates);
      }
    }, [searchText]);

    return ( <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => {
           setSearchText(text);
           RatesModel.instance.searchText = text;
          }} 
          keyboardType="default"
          autoCapitalize="none"
          placeholder="Пошук валюти"
          placeholderTextColor="#aaa"/>
        <TouchableOpacity style={styles.searchButton}>
          <Image source ={require("../../shared/assets/images/Search_Icon.png")} style={styles.searchButtonImg}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton}
          onPress={() => {
            setSearchText("");
            RatesModel.instance.searchText = "";
          }}>
          <Image source={require("../../shared/assets/images/close.png")} style={styles.searchButtonImg}/>
         </TouchableOpacity>

      </View>
      <FlatList
        data={rates.filter(rate =>
         rate.txt.toLowerCase().includes(searchText.toLowerCase()) ||
         rate.cc.toLowerCase().includes(searchText.toLowerCase())
      )}
        renderItem={rateItem}
        keyExtractor={rate => rate.cc}
        style={styles.ratesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#333",
  },
  ratesList: {
    flex: 1,
    width: "100%",
  },
  searchBar: {
    width: "100%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput:{
    flex: 1,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 10,
    color: "#f2f2f2",
  },
  searchButton: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    backgroundColor: "#404040",
    borderRadius: 8,
  },
  searchButtonImg: {
    width: 44,
    height: 44,
    margin: 3,
  },  
});