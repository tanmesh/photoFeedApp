import React from "react";
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
// import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { YellowBox } from "react-native";
import Feed from "./app/screens/feed";
import Upload from "./app/screens/upload";
import Profile from "./app/screens/profile";
import UserProfile from "./app/screens/userProfile";
import Comments from "./app/screens/comments";

YellowBox.ignoreWarnings(["Require cycle:"]);

const TabStack = createBottomTabNavigator({
  Feed: { screen: Feed },
  Upload: { screen: Upload },
  Profile: { screen: Profile }
});

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: UserProfile },
    Comments: { screen: Comments }
  },
  {
    initialRouteName: "Home",
    mode: "modal",
    headerMode: "none"
  }
);
 
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <MainStack />;
  }
}
