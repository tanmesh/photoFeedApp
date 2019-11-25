import React from "react";
import { TouchableOpacity, TextInput, StyleSheet, Text, View } from "react-native";

import { db, auth } from "../../config/config";

export default class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: "",
      pass: "",
      moveScreen: false
    };
  }

  componentDidMount = () => {
    if (this.props.moveScreen == true) {
      this.setState({ moveScreen: true });
    }
  };

  login = async () => {
    //Force user to login
    const email = this.state.email;
    const password = this.state.pass;
    if (email != "" && password != "") {
      try {
        let user = await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.log("Error in login: ", error);
        alert(error);
      }
    } else {
      alert("Please fill in email and password fields!");
    }
  };

  createUserObj = (userObj, email) => {
    console.log(userObj, email, userObj.uid);
    const uObj = {
      name: "Enter name",
      username: "@username",
      avatar: "http://www.gravatar.com/avatar",
      email: email
    };
    db.ref("users")
      .child(userObj.uid)
      .set(uObj);
  };

  signup = async () => {
    //Force user to login
    const email = this.state.email;
    const password = this.state.pass;
    if (email != "" && password != "") {
      try {
        let userObj = await auth.createUserWithEmailAndPassword(email, password);
        this.createUserObj(userObj.user, email);
      } catch (error) {
        console.log("Error in login: ", error);
        alert(error);
      }
    } else {
      alert("Please fill in email and password fields!");
    }
  };

  showLogin = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 1 });
  };

  showSignup = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 2 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>You are not logged in.</Text>
        <Text>{this.props.message}</Text>

        {this.state.authStep == 0 ? (
          <View style={{ marginVertical: 20, flexDirection: "row" }}>
            <TouchableOpacity onPress={() => this.showLogin()}>
              <Text style={{ fontWeight: "bold", color: "green" }}>Login   </Text>
            </TouchableOpacity>

            <Text style={{ marginHorizontal: 10 }}>or</Text>

            <TouchableOpacity onPress={() => this.showSignup()}>
              <Text style={{ fontWeight: "bold", color: "blue" }}>Sign Up   </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            {this.state.authStep == 1 ? (
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{ borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: "black" }}
                >
                  <Text style={{ fontWeight: "bold" }}>↙ Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: "bold", marginBottom: 20 }}>Login</Text>
                <Text>Email Address</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder="Enter your email address..."
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderRadius: 3,
                    borderWidth: 1
                  }}
                />
                <Text>Password</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder="Enter your password..."
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderRadius: 3,
                    borderWidth: 1
                  }}
                />
                <TouchableOpacity
                  style={{ backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
                  onPress={() => this.login()}
                >
                  <Text style={{ color: "white" }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{ borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: "black" }}
                >
                  <Text style={{ fontWeight: "bold" }}>↙ Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: "bold", marginBottom: 20 }}>Login</Text>
                <Text>Email Address</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder="Enter your email address..."
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderRadius: 3,
                    borderWidth: 1
                  }}
                />
                <Text>Password</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder="Enter your password..."
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderRadius: 3,
                    borderWidth: 1
                  }}
                />
                <TouchableOpacity
                  style={{ backgroundColor: "blue", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
                  onPress={() => this.signup()}
                >
                  <Text style={{ color: "white" }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
