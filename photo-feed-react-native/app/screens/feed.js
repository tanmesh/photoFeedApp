import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PhotoList from "../components/photoList";

export default class Feed extends React.Component {
  render() {
    return (
      <View style={styles.headContainer}>
        <View style={styles.head}>
          <Text>Feed</Text>
        </View>

        <PhotoList isUser={false} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headContainer: {
    flex: 1
  },
  head: {
    height: 70,
    paddingTop: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    alignItems: "center"
  }
});
