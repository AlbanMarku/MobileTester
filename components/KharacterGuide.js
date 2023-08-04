import { Text, View, StyleSheet, Image } from 'react-native';
import { client } from '../components/SanityClient';
import { useEffect, useState } from 'react';
import StrategyComp from './StratagyComp';
import Title from './Title';

export default function KharacterGuide({ name, profile }) {
  const [strategyInfo, setStrategyInfo] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);

  const fetchGuide = async () => {
    try {
      setFetchComplete(false);
      const queryData = await client.fetch(
        `*[_type == "kharacter" && name == "${name}"][0]{_id, guide}`
      );
      if (queryData.guide) {
        setStrategyInfo(queryData.guide.strategy);
        console.log('yah');
      } else {
        setStrategyInfo([]);
        console.log('nah');
      }
      setFetchComplete(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, []);

  const MapThroughStrats = () => {
    const strats = strategyInfo.map((item) => {
      return (
        <StrategyComp
          info={item.strategyInfo}
          title={item.strategyTitle}
          videoUrl={item.videoUrl}
          key={item._key}
        />
      );
    });
    return strats;
  };

  return (
    <View>
      <Title name={name} />
      <View style={styles.imageDiv}>
        <Image style={{ height: 300, width: 300 }} source={{ uri: profile }} />
      </View>
      <Title name={'Guide'} underline />
      <Title name={'Strategy'} subHeader />
      {fetchComplete && strategyInfo.length > 0 ? (
        <MapThroughStrats />
      ) : fetchComplete && strategyInfo.length === 0 ? (
        <View style={styles.noItemDiv}>
          <Text style={{ color: 'white' }}>No strats</Text>
        </View>
      ) : (
        <Text style={{ fontSize: 40, color: 'white', flex: 1 }}>
          I am loading the stats pls chill out
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageDiv: {
    alignItems: 'center',
  },
  noItemDiv: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
  },
});
