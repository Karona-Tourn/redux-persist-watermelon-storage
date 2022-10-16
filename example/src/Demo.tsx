import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setGames } from './actions';
import type { Game } from './model';

const Demo = () => {
  const dispatch = useDispatch();
  const games: Game[] = useSelector((state: any) => state.games ?? []);

  useEffect(() => {
    if (games.length === 0) {
      dispatch(
        setGames(
          [...Array(200)].map((_, i) => ({
            name: `Game ${i}`,
            description: `This is game ${i}`,
          }))
        )
      );
    }
  }, [games, dispatch]);

  const renderItem: any = ({ item }: { item: Game }) => {
    return <ListItem data={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const ListItem: React.FC<{
  data: Game;
}> = ({ data }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.txtName}>{data.name}</Text>
      <Text style={styles.txtDesc}>{data.description}</Text>
    </View>
  );
};

export default Demo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingHorizontal: 16,
  },

  item: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 16,
  },

  txtName: {
    fontSize: 18,
    fontWeight: '600',
  },

  txtDesc: {
    marginTop: 10,
    color: 'grey',
  },
});
