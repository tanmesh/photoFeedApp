import React from "react";
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from "react-native";

import { db } from "../../config/config";
import { timeConverter } from "../utils";

export default class PhotoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoFeed: [],
      refresh: false,
      loading: true,
      empty: false
    };
  }

  componentDidMount = () => {
    const { isUser, userId } = this.props;
    if (isUser) {
      //Profile
      this.loadFeed(userId);
    } else {
      this.loadFeed("");
    }
  };

  addToFlatList = async (photo_feed, data, photo) => {
    try {
      const photoObj = data[photo];
      const userSnapshot = await db
        .ref("users")
        .child(photoObj.author)
        .child("username")
        .once("value");
      const user_exists = userSnapshot.val() !== null;
      if (user_exists) {
        data = userSnapshot.val();
      }
      photo_feed.push({
        id: photo,
        url: photoObj.url,
        caption: photoObj.caption,
        posted: timeConverter(photoObj.posted),
        timestamp: photoObj.posted,
        author: data,
        authorId: photoObj.author
      });

      const myData = [].concat(photo_feed).sort((a, b) => a.timestamp < b.timestamp);

      this.setState({ refresh: false, loading: false, photoFeed: myData });
    } catch (error) {
      console.log(error);
    }
  };

  loadNew = () => {
    this.loadFeed();
  };

  loadFeed = async (userId = "") => {
    this.setState({ refresh: true, photoFeed: [] });
    var that = this;
    var loadRef = db.ref("photos");
    if (userId != "") {
      loadRef = db
        .ref("users")
        .child(userId)
        .child("photos");
    }
    try {
      const snapshot = await loadRef.orderByChild("posted").once("value");
      const photo_exists = snapshot.val() !== null;
      if (photo_exists) {
        data = snapshot.val();
        let photoFeed = that.state.photoFeed;
        that.setState({ empty: false });
        for (let photo in data) {
          that.addToFlatList(photoFeed, data, photo);
        }
      } else {
        that.setState({ empty: true });
      }
    } catch (error) {
      console.log("Fetching error: ", error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading == true ? (
          <View style={styles.loading}>
            {this.state.empty == true ? <Text>There is no photos found.</Text> : <Text>Loading...</Text>}
          </View>
        ) : (
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photoFeed}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatlist}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.listitem}>
                <View style={styles.listitemhead}>
                  <Text>{item.posted}</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("User", { userId: item.authorId })}>
                    <Text>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Image source={{ uri: item.url }} style={styles.image} />
                </View>
                <View style={styles.listitemfooter}>
                  <Text>{item.caption}</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Comments", { photoId: item.id })}>
                    <Text style={styles.viewcomments}> [View comments] </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  flatlist: {
    flex: 1,
    backgroundColor: "#eee"
  },
  listitem: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 5,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "grey"
  },
  listitemhead: {
    padding: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listitemfooter: {
    padding: 5
  },
  viewcomments: {
    textAlign: "center",
    marginTop: 10,
    color: "blue"
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: 275
  }
});
