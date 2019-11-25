import React from "react";
import {
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";

import { f, db } from "../../config/config";
import { timeConverter, uniqueId } from "../utils";
import UserAuth from "../components/auth";

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      commentsList: [],
      comment: ""
    };
  }

  checkParams = () => {
    const params = this.props.navigation.state.params;
    if (params) {
      if (params.photoId) {
        this.setState({ photoId: params.photoId });
        this.fetchComments(params.photoId);
      }
    }
  };

  addCommentToList = async (commentsList, data, comment) => {
    var that = this;
    const commentObj = data[comment];
    try {
      const snapshot = await db
        .ref("users")
        .child(commentObj.author)
        .child("username")
        .once("value");
      const exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      commentsList.push({
        id: comment,
        comment: commentObj.comment,
        posted: timeConverter(commentObj.posted),
        author: data,
        authorId: commentObj.author
      });
      that.setState({ refresh: false, loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  fetchComments = async photoId => {
    var that = this;
    try {
      const snapshot = await db
        .ref("comments")
        .child(photoId)
        .orderByChild("posted")
        .once("value");
      const exists = snapshot.val() !== null;
      if (exists) {
        data = snapshot.val();
        var commentsList = that.state.commentsList;
        for (var comment in data) {
          that.addCommentToList(commentsList, data, comment);
        }
      } else {
        that.setState({ commentsList: [] });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    this.checkParams();
  };

  postComment = () => {
    const comment = this.state.comment;
    if (comment != "") {
      const photoId = this.state.photoId;
      const userId = f.auth().currentUser.uid;
      const commentId = uniqueId();
      const timestamp = Math.floor(Date.now() / 1000);
      this.setState({ comment: "" });
      const commentObj = {
        posted: timestamp,
        author: userId,
        comment: comment
      };
      db.ref("/comments/" + photoId + "/" + commentId).set(commentObj);
      this.reloadCommentList();
    } else {
      alert("Please enter a comment for posting!");
    }
  };

  reloadCommentList = () => {
    this.setState({ commentsList: [] });
    this.fetchComments(this.state.photoId);
  };

  render() {
    return (
      <View style={styles.headContainer}>
        <View style={styles.head}>
          <TouchableOpacity style={{ width: 100 }} onPress={() => this.props.navigation.goBack()}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Go Back</Text>
          </TouchableOpacity>
          <Text>Comments</Text>
          <Text style={{ width: 100 }} />
        </View>

        {this.state.commentsList.length == 0 ? (
          //Empty
          <View>
            <Text>No comments found.</Text>
          </View>
        ) : (
          //Flatlist
          <FlatList
            data={this.state.commentsList}
            refreshing={this.state.refresh}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "#eee" }}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: "100%",
                  overflow: "hidden",
                  marginBottom: 5,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderColor: "grey"
                }}
              >
                <View style={{ padding: 5, width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>{item.posted}</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("User", { userId: item.authorId })}>
                    <Text>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 5 }}>
                  <Text>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        )}

        {this.state.loggedin == true ? (
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={{ borderTopWidth: 1, borderTopColor: "grey", padding: 10, marginBottom: 15 }}
          >
            <Text style={{ fontWeight: "bold" }}>Post Comment</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TextInput
                editable={true}
                placeholder="Enter your comment here..."
                onChangeText={text => this.setState({ comment: text })}
                value={this.state.comment}
                autocomplete={false}
                style={{
                  flex: 1,
                  height: 50,
                  marginVertical: 15,
                  padding: 5,
                  borderColor: "grey",
                  borderRadius: 3,
                  backgroundColor: "white",
                  color: "black"
                }}
              />
              <TouchableOpacity
                onPress={() => this.postComment()}
                style={{
                  width: 50,
                  height: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: "blue",
                  borderRadius: 3,
                  marginLeft: 10,
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: "white" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <UserAuth message="Please log in to post a comment." moveScreen={true} navigation={this.props.navigation} />
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
