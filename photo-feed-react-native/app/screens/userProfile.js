import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";

import { db } from "../../config/config";
import PhotoList from "../components/photoList";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount = () => {
    this.checkParams();
  };

  checkParams = () => {
    const params = this.props.navigation.state.params;
    if (params) {
      if (params.userId) {
        this.setState({ userId: params.userId });
        this.fetchUserInfo(params.userId);
      }
    }
  };

  fetchUserInfo = async userId => {
    var that = this;
    try {
      let snapshot = await db
        .ref("users")
        .child(userId)
        .child("username")
        .once("value");
      let exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      that.setState({ username: data });
    } catch (error) {
      console.log("Fetching username error: ", error);
    }

    try {
      let snapshot = await db
        .ref("users")
        .child(userId)
        .child("name")
        .once("value");
      let exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      that.setState({ name: data });
    } catch (error) {
      console.log("Fetching name error: ", error);
    }

    try {
      let snapshot = await db
        .ref("users")
        .child(userId)
        .child("avatar")
        .once("value");
      let exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      that.setState({ avatar: data, loaded: true });
    } catch (error) {
      console.log("Fetching avatar error: ", error);
    }
  };

  render() {
    return (
      <View style={styles.headContainer}>
        {this.state.loaded == false ? (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.headContainer}>
            <View style={styles.head}>
              <TouchableOpacity style={{ width: 100 }} onPress={() => this.props.navigation.goBack()}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>Go Back</Text>
              </TouchableOpacity>
              <Text>Profile</Text>
              <Text style={{ width: 100 }} />
            </View>
            <View style={styles.profileContainer}>
              <Image source={{ uri: this.state.avatar }} style={styles.image} />
              <View style={styles.nameHolder}>
                <Text>{this.state.name}</Text>
                <Text>{this.state.username}</Text>
              </View>
            </View>
            <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headContainer: {
    flex: 1
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green"
  },
  head: {
    height: 70,
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  profileContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10
  },
  image: {
    marginLeft: 10,
    width: 100,
    height: 100,
    borderRadius: 50
  },
  nameHolder: {
    marginRight: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
