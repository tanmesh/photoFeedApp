import React from "react";
import { TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
// import { Permissions, ImagePicker } from "expo";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { f, db, auth, storage } from "../../config/config";
import { uniqueId } from "../utils";
import UserAuth from "../components/auth";

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        //Logged in
        that.setState({ loggedin: true });
      } else {
        //Logged out
        that.setState({ loggedin: false });
      }
    });
  };

  _checkPermissions = async () => {
    try {
      const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ camera: statusCamera });
      const { statusCameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ cameraRoll: statusCameraRoll });
    } catch (error) {
      console.log("Error in permissions checking: ", error);
    }
  };

  findNewImage = async () => {
    this._checkPermissions();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        quality: 1
      });
      if (!result.cancelled) {
        this.setState({ imageSelected: true, imageId: uniqueId(), uri: result.uri });
      } else {
        console.log("Image picking cancelled");
      }
    } catch (error) {
      this.setState({
        imageSelected: false
      });
      console.log("Error during image picking: ", error);
    }
  };

  uploadPublish = () => {
    if (this.state.uploading == false) {
      if (this.state.caption != "") {
        this.uploadImage(this.state.uri);
      } else {
        alert("Please enter the caption!");
      }
    } else {
      console.log("Ignored button tap due on uploading...");
    }
  };

  uploadImage = async uri => {
    var that = this;
    const userId = auth.currentUser.uid;
    const imageId = this.state.imageId;
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(uri)[1];
    that.setState({ currentFileType: ext, uploading: true });
    const filepath = imageId + "." + that.state.currentFileType;
    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      this.completeUploadBlob(blob, filepath);
    };
    oReq.send();
  };

  completeUploadBlob = (blob, FilePath) => {
    var that = this;
    var userId = auth.currentUser.uid;
    var imageId = this.state.imageId;

    var uploadTask = storage
      .ref("user/" + userId + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log(error);
        console.log("error with upload - " + error.message);
      },
      function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };

  processUpload = imageUrl => {
    //set needed data
    const imageId = this.state.imageId;
    var userId = f.auth().currentUser.uid;
    const caption = this.state.caption;
    const datetime = Date.now();
    const timestamp = Math.floor(datetime / 1000);
    //Build photo object
    const photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };
    //Update DB
    //Add to main feed
    db.ref("/photos/" + imageId).set(photoObj);
    //Set user's photos object
    db.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);
    this.setState({ uploading: false, imageSelected: false, caption: "", uri: "" });
    alert("Image uploaded!");
  };

  render() {
    return (
      <View style={styles.headContainer}>
        {this.state.loggedin == true ? (
          <View style={styles.headContainer}>
            {this.state.imageSelected == true ? (
              <View style={styles.headContainer}>
                <View style={styles.head}>
                  <Text>Upload</Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Caption</Text>
                  <TextInput
                    editable={true}
                    placeholder="Enter photo caption"
                    maxLength={150}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ caption: text })}
                    value={this.state.caption}
                    autocomplete={false}
                    style={{
                      marginVertical: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: "white"
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={{
                      width: 170,
                      alignSelf: "center",
                      marginHorizontal: "auto",
                      backgroundColor: "purple",
                      borderRadius: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>Upload & Publish</Text>
                  </TouchableOpacity>

                  {this.state.uploading && (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}%</Text>
                      {this.state.progress != 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Text>Processing...</Text>
                      )}
                    </View>
                  )}

                  <Image
                    source={{ uri: this.state.uri }}
                    style={{ marginTop: 10, resizeMode: "cover", width: "100%", height: 275 }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.container}>
                <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "blue", borderRadius: 5 }}
                  onPress={() => this.findNewImage()}
                >
                  <Text style={{ color: "white" }}>Select a photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <UserAuth message="Please log in to upload images." />
        )}
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
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
