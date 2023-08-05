import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext, useEffect, useState } from 'react';
import Home from '../views/Home';
import About from '../views/About';
import HeaderComp from '../components/HeaderComp';
import { MyContext } from '../Context';
import { client, urlFor } from '../components/SanityClient';
import { setupDb } from '../myDb';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  const [input, setInput, rosterData, setRosterData] = useContext(MyContext);

  const fetchRoster = async () => {
    console.log('fetching...');
    //Fetch all karacters. Get their name, avatar, profile image. Map through each khacaracter and create touchable box.
    try {
      setRosterData([]);
      const queryData = await client.fetch(
        " *[_type == 'kharacter']{ _id,name, avatar, profile, basicAttacks[]{..., attackType->{name}},stringAttacks[]{..., attackType->{name}},basicAttacks[]{..., attackType->{name}},specialAttacks[]{...,attackType->{name}}}"
      );
      const extractedData = queryData.map((item) => {
        const parsedAvatarImg = urlFor(item.avatar.asset._ref);
        const parsedProfileImg = urlFor(item.profile.asset._ref);
        const basicAttacks = item.basicAttacks ? item.basicAttacks : [];
        const stringAttacks = item.stringAttacks ? item.stringAttacks : [];
        const specialAttacks = item.specialAttacks ? item.specialAttacks : [];
        return {
          name: item.name,
          avatar: parsedAvatarImg.url(),
          profile: parsedProfileImg.url(),
          basicAttacks: basicAttacks,
          stringAttacks: stringAttacks,
          specialAttacks: specialAttacks,
        };
      });
      await setupDb(extractedData);
      setRosterData(extractedData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black',
          shadowColor: 'white',
        },
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'mk11',
        },
        drawerItemStyle: {
          backgroundColor: 'red',
        },
        drawerContentStyle: {
          backgroundColor: 'red',
        },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={Home}
        options={{
          headerRight: () => <HeaderComp option={'download'} fetchRoster={fetchRoster} />,
        }}
      />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
}
