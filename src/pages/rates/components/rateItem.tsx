import { StyleSheet, Text, View } from "react-native";
import NbuRate from "../types/NbuRates";

function rateItem({item, index}:{item:NbuRate, index:number}) {
    return <View style={[styles.rateItem, index % 2===0 ? styles.bgEven : styles.bgOdd]}>
        <Text style={styles.rateCc}>{item.cc}</Text>
        <Text style={styles.rateTxt}>{item.txt}</Text>
        <Text style={styles.rateRate}>{item.rate}</Text>
    </View>
}

const styles = StyleSheet.create({
  container: {
    padding:10,
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 10
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5
  },
  searchButtonText: {
    color: "#fff"
  },  
  bgEven: {
    backgroundColor: "#4A4A4A"
  },
   bgOdd: {
    backgroundColor: "#454545"
  }, 
  rateItem: {
    //backgroundColor: "#FCF7F0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft:10,
    paddingVertical:5,
    width: "100%"
  },
  rateCc: {
    color:"#d7ff24ff",
    flex: 1,
  },
  rateTxt: {
    color:"#FCF7F0",
    flex: 3,
  },
  rateRate: {
    color:"#c92a2ae0",
    flex: 2,
  },
});

export default rateItem;