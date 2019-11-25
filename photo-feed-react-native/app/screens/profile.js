import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image, TextInput } from "react-native";

import { f, db } from "../../config/config";
import PhotoList from "../components/photoList";
import UserAuth from "../components/auth";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      editingProfile: false
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        //Logged in
        that.fetchUserInfo(user.uid);
      } else {
        //Logged out
        that.setState({ loggedin: false });
      }
    });
  };

  fetchUserInfo = async userId => {
    var that = this;
    try {
      const snapshot = await db
        .ref("users")
        .child(userId)
        .once("value");
      const exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      that.setState({ username: data.username, name: data.name, avatar: data.avatar, loggedin: true, userId: userId });
    } catch (error) {
      console.log(error);
    }
  };

  logoutUser = () => {
    f.auth().signOut();
    alert("Successfully logged out!");
  };

  editProfile = () => {
    this.setState({ editingProfile: true });
  };

  saveProfile = () => {
    const name = this.state.name;
    const username = this.state.username;
    if (name != "") {
      db.ref("users")
        .child(this.state.userId)
        .child("name")
        .set(name);
      db.ref("users")
        .child(this.state.userId)
        .child("username")
        .set(username);
      this.setState({ editingProfile: false });
    }
  };

  render() {
    return (
      <View style={styles.headContainer}>
        {this.state.loggedin == true ? (
          <View style={styles.headContainer}>
            <View style={styles.head}>
              <Text>Profile</Text>
            </View>
            <View style={styles.profileContainer}>
              <Image source={{ uri: this.state.avatar }} style={styles.image} />
              <View style={styles.nameHolder}>
                <Text>{this.state.name}</Text>
                <Text>{this.state.username}</Text>
              </View>
            </View>

            {this.state.editingProfile == true ? (
              <View style={styles.formHolder}>
                <TouchableOpacity onPress={() => this.setState({ editingProfile: false })}>
                  <Text style={{ fontWeight: "bold" }}>Cancel Editing</Text>
                </TouchableOpacity>
                <Text>Name:</Text>
                <TextInput
                  editable={true}
                  placeholder="Enter your name..."
                  onChangeText={text => this.setState({ name: text })}
                  value={this.state.name}
                  style={{ width: 250, marginVertical: 10, padding: 5, borderColor: "grey", borderWidth: 1 }}
                />
                <Text>Username:</Text>
                <TextInput
                  editable={true}
                  placeholder="Enter your username..."
                  onChangeText={text => this.setState({ username: text })}
                  value={this.state.username}
                  style={{ width: 250, marginVertical: 10, padding: 5, borderColor: "grey", borderWidth: 1 }}
                />
                <TouchableOpacity onPress={() => this.saveProfile()} style={{ padding: 10, backgroundColor: "blue" }}>
                  <Text style={{ fontWeight: "bold", color: "white" }}>Save changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsHolder}>
                <TouchableOpacity style={styles.button} onPress={() => this.logoutUser()}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.editProfile()}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newbutton} onPress={() => this.props.navigation.navigate("Upload")}>
                  <Text style={styles.newbuttonText}>Upload New +</Text>
                </TouchableOpacity>
              </View>
            )}

            <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
          </View>
        ) : (
          <UserAuth message="Please log in to view your profile." />
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
    paddingTop: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 0.5,
    justifyContent: "center",
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
  buttonsHolder: {
    paddingBottom: 20,
    borderBottomWidth: 1
  },
  button: {
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    borderColor: "grey",
    borderWidth: 1.5
  },
  newbutton: {
    backgroundColor: "grey",
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    borderColor: "grey",
    borderWidth: 1.5
  },
  buttonText: {
    textAlign: "center",
    color: "grey"
  },
  newbuttonText: {
    textAlign: "center",
    color: "white"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  formHolder: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
